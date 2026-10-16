-- QuickMed pharmacy portal + internal app.
--
-- Pharmacies (clients) submit delivery requests; each request holds one or more
-- patient stops (deliveries). QuickMed staff see everything and mark stops complete.
--
-- Privacy model (PHIPA / PIPEDA):
--   * Row-level security on every table: a pharmacy login can only read its own
--     pharmacy's rows; only staff can read across pharmacies or change status.
--   * Writes from pharmacies go through submit_delivery_request(), never direct inserts.
--   * Every submission and status change lands in audit_log.
--   * purge_patient_details() blanks patient PII some days after completion.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.pharmacies (
    id uuid primary key default gen_random_uuid(),
    name text not null check (length(trim(name)) > 0),
    contact_name text,
    email text not null,
    phone text,
    street text,
    city text,
    province text not null default 'ON',
    postal_code text,
    notes text,
    status text not null default 'active' check (status in ('active', 'paused')),
    -- Sales demo account: seeded with made-up data, hidden from the staff delivery board.
    is_demo boolean not null default false,
    created_at timestamptz not null default now()
);

create table public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    role text not null check (role in ('pharmacy', 'staff')),
    pharmacy_id uuid references public.pharmacies (id) on delete cascade,
    full_name text,
    email text,
    created_at timestamptz not null default now(),
    -- Pharmacy logins must belong to a pharmacy; staff logins must not.
    check ((role = 'pharmacy') = (pharmacy_id is not null))
);

create index profiles_pharmacy_id_idx on public.profiles (pharmacy_id);

create table public.delivery_requests (
    id uuid primary key default gen_random_uuid(),
    pharmacy_id uuid not null references public.pharmacies (id) on delete cascade,
    submitted_by uuid references auth.users (id) on delete set null,
    delivery_date date,
    notes text,
    created_at timestamptz not null default now()
);

create index delivery_requests_pharmacy_id_idx on public.delivery_requests (pharmacy_id, created_at desc);

create table public.deliveries (
    id uuid primary key default gen_random_uuid(),
    request_id uuid not null references public.delivery_requests (id) on delete cascade,
    -- Denormalised from the request so row-level security is a single column check.
    pharmacy_id uuid not null references public.pharmacies (id) on delete cascade,
    patient_first_name text,
    patient_last_name text,
    street text,
    street2 text,
    city text,
    province text,
    postal_code text,
    phone text,
    flags text[] not null default '{}'
        check (flags <@ array['narcotic', 'refrigerated', 'cod', 'reverse_pickup', 'asap']),
    status text not null default 'pending' check (status in ('pending', 'completed', 'cancelled')),
    completed_at timestamptz,
    completed_by uuid references auth.users (id) on delete set null,
    redacted_at timestamptz,
    created_at timestamptz not null default now()
);

create index deliveries_pharmacy_id_idx on public.deliveries (pharmacy_id, created_at desc);
create index deliveries_status_idx on public.deliveries (status, created_at desc);
create index deliveries_request_id_idx on public.deliveries (request_id);

create table public.audit_log (
    id bigint generated always as identity primary key,
    at timestamptz not null default now(),
    actor uuid,
    action text not null,
    table_name text not null,
    row_id uuid,
    details jsonb not null default '{}'
);

create index audit_log_row_id_idx on public.audit_log (row_id);

-- ---------------------------------------------------------------------------
-- Role helpers (security definer so policies can read profiles without recursion)
-- ---------------------------------------------------------------------------

create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = ''
as $$
    select exists (
        select 1 from public.profiles where id = auth.uid() and role = 'staff'
    );
$$;

create or replace function public.my_pharmacy_id()
returns uuid
language sql stable security definer set search_path = ''
as $$
    select pharmacy_id from public.profiles where id = auth.uid() and role = 'pharmacy';
$$;

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------

alter table public.pharmacies enable row level security;
alter table public.profiles enable row level security;
alter table public.delivery_requests enable row level security;
alter table public.deliveries enable row level security;
alter table public.audit_log enable row level security;

-- Nothing is readable without logging in.
revoke all on all tables in schema public from anon;
revoke all on all functions in schema public from anon;
revoke all on all sequences in schema public from anon;

create policy "pharmacies: own or staff can read" on public.pharmacies
    for select to authenticated
    using (id = public.my_pharmacy_id() or public.is_staff());

create policy "pharmacies: staff can update" on public.pharmacies
    for update to authenticated
    using (public.is_staff()) with check (public.is_staff());

create policy "profiles: self or staff can read" on public.profiles
    for select to authenticated
    using (id = auth.uid() or public.is_staff());

create policy "requests: own pharmacy or staff can read" on public.delivery_requests
    for select to authenticated
    using (pharmacy_id = public.my_pharmacy_id() or public.is_staff());

create policy "deliveries: own pharmacy or staff can read" on public.deliveries
    for select to authenticated
    using (pharmacy_id = public.my_pharmacy_id() or public.is_staff());

create policy "deliveries: staff can update" on public.deliveries
    for update to authenticated
    using (public.is_staff()) with check (public.is_staff());

create policy "audit_log: staff can read" on public.audit_log
    for select to authenticated
    using (public.is_staff());

-- Column-level: staff may only change status on deliveries and CRM fields on pharmacies.
revoke update on public.deliveries from authenticated;
grant update (status) on public.deliveries to authenticated;
revoke update on public.pharmacies from authenticated;
grant update (contact_name, phone, street, city, province, postal_code, notes, status)
    on public.pharmacies to authenticated;
revoke insert, delete on all tables in schema public from authenticated;

-- ---------------------------------------------------------------------------
-- Delivery status changes: stamp completion and audit
-- ---------------------------------------------------------------------------

create or replace function public.on_delivery_status_change()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
    if new.status is distinct from old.status then
        if new.status = 'completed' then
            new.completed_at := now();
            new.completed_by := auth.uid();
        else
            new.completed_at := null;
            new.completed_by := null;
        end if;

        insert into public.audit_log (actor, action, table_name, row_id, details)
        values (auth.uid(), 'status_change', 'deliveries', new.id,
                jsonb_build_object('from', old.status, 'to', new.status));
    end if;
    return new;
end;
$$;

create trigger deliveries_status_change
    before update on public.deliveries
    for each row execute function public.on_delivery_status_change();

-- ---------------------------------------------------------------------------
-- Pharmacy submission: one request + its stops, atomically
-- ---------------------------------------------------------------------------

create or replace function public.submit_delivery_request(
    p_delivery_date date,
    p_notes text,
    p_stops jsonb
)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
    v_pharmacy uuid := public.my_pharmacy_id();
    v_request uuid;
    v_stop jsonb;
    v_status text;
begin
    if v_pharmacy is null then
        raise exception 'Only pharmacy accounts can submit delivery requests' using errcode = '42501';
    end if;

    select status into v_status from public.pharmacies where id = v_pharmacy;
    if v_status <> 'active' then
        raise exception 'This pharmacy account is paused. Please call QuickMed.' using errcode = '42501';
    end if;

    if jsonb_typeof(p_stops) <> 'array' or jsonb_array_length(p_stops) = 0 then
        raise exception 'Add at least one patient' using errcode = '22023';
    end if;

    if jsonb_array_length(p_stops) > 100 then
        raise exception 'At most 100 patients per request' using errcode = '22023';
    end if;

    insert into public.delivery_requests (pharmacy_id, submitted_by, delivery_date, notes)
    values (v_pharmacy, auth.uid(), p_delivery_date, nullif(trim(p_notes), ''))
    returning id into v_request;

    for v_stop in select * from jsonb_array_elements(p_stops) loop
        if coalesce(trim(v_stop ->> 'first_name'), '') = ''
            or coalesce(trim(v_stop ->> 'last_name'), '') = ''
            or coalesce(trim(v_stop ->> 'street'), '') = ''
            or coalesce(trim(v_stop ->> 'city'), '') = ''
            or coalesce(trim(v_stop ->> 'phone'), '') = '' then
            raise exception 'Each patient needs a name, street address, city and phone' using errcode = '22023';
        end if;

        insert into public.deliveries (
            request_id, pharmacy_id, patient_first_name, patient_last_name,
            street, street2, city, province, postal_code, phone, flags
        ) values (
            v_request, v_pharmacy,
            trim(v_stop ->> 'first_name'), trim(v_stop ->> 'last_name'),
            trim(v_stop ->> 'street'), nullif(trim(v_stop ->> 'street2'), ''),
            trim(v_stop ->> 'city'), coalesce(nullif(trim(v_stop ->> 'province'), ''), 'ON'),
            upper(nullif(trim(v_stop ->> 'postal_code'), '')), trim(v_stop ->> 'phone'),
            coalesce(array(select jsonb_array_elements_text(v_stop -> 'flags')), '{}')
        );
    end loop;

    insert into public.audit_log (actor, action, table_name, row_id, details)
    values (auth.uid(), 'submit', 'delivery_requests', v_request,
            jsonb_build_object('stops', jsonb_array_length(p_stops)));

    return v_request;
end;
$$;

revoke all on function public.submit_delivery_request(date, text, jsonb) from public, anon;
grant execute on function public.submit_delivery_request(date, text, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- CRM numbers per client (respects the caller's row-level security)
-- ---------------------------------------------------------------------------

create view public.pharmacy_stats
with (security_invoker = true)
as
select
    p.id as pharmacy_id,
    p.name,
    p.contact_name,
    p.email,
    p.phone,
    p.status,
    p.is_demo,
    p.created_at,
    (select count(*) from public.delivery_requests r where r.pharmacy_id = p.id) as request_count,
    count(d.id) as delivery_count,
    count(d.id) filter (where d.status = 'completed') as completed_count,
    count(d.id) filter (where d.status = 'pending') as pending_count,
    (select max(r.created_at) from public.delivery_requests r where r.pharmacy_id = p.id) as last_request_at
from public.pharmacies p
left join public.deliveries d on d.pharmacy_id = p.id
group by p.id;

grant select on public.pharmacy_stats to authenticated;

-- ---------------------------------------------------------------------------
-- Retention: blank patient details N days after a stop is finished.
-- Schedule daily with pg_cron (see PORTAL.md):
--   select cron.schedule('purge-patient-details', '0 8 * * *', $$select public.purge_patient_details(180)$$);
-- ---------------------------------------------------------------------------

create or replace function public.purge_patient_details(p_days integer default 180)
returns integer
language plpgsql security definer set search_path = ''
as $$
declare
    v_count integer;
begin
    update public.deliveries
    set patient_first_name = null,
        patient_last_name = null,
        street = null,
        street2 = null,
        postal_code = null,
        phone = null,
        redacted_at = now()
    where redacted_at is null
      and status in ('completed', 'cancelled')
      and coalesce(completed_at, created_at) < now() - make_interval(days => p_days);
    get diagnostics v_count = row_count;
    return v_count;
end;
$$;

revoke all on function public.purge_patient_details(integer) from public, anon, authenticated;
