-- Public sign-ups: "Become a partner" requests land in the CRM as pending partners
-- that staff approve (which sends the login invite) or deny; "Become a driver"
-- applications are stored with their resume. Run after 0001_portal.sql.

-- Pharmacies gain the pending and denied states, and remember where they came from.
alter table public.pharmacies drop constraint if exists pharmacies_status_check;
alter table public.pharmacies
    add constraint pharmacies_status_check check (status in ('pending', 'active', 'paused', 'denied'));
alter table public.pharmacies
    add column if not exists source text not null default 'admin' check (source in ('admin', 'signup'));

-- CRM: when each client last had a delivery completed (who's active and who isn't).
-- New columns go at the end so `create or replace view` keeps the existing ones.
create or replace view public.pharmacy_stats
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
    (select max(r.created_at) from public.delivery_requests r where r.pharmacy_id = p.id) as last_request_at,
    max(d.completed_at) as last_delivery_at,
    p.source,
    p.street,
    p.city
from public.pharmacies p
left join public.deliveries d on d.pharmacy_id = p.id
group by p.id;

grant select on public.pharmacy_stats to authenticated;

-- Driver applications. Written only by the server (service role); staff can read.
create table if not exists public.driver_applications (
    id uuid primary key default gen_random_uuid(),
    full_name text not null,
    phone text not null,
    email text not null,
    resume_path text,
    created_at timestamptz not null default now()
);

alter table public.driver_applications enable row level security;
revoke all on public.driver_applications from anon, authenticated;
grant select on public.driver_applications to authenticated;

drop policy if exists "driver_applications: staff can read" on public.driver_applications;
create policy "driver_applications: staff can read" on public.driver_applications
    for select to authenticated
    using (public.is_staff());

-- Private bucket for resumes (stored in the project's region, Canada). Only the
-- server writes to it; no public access.
do $$
begin
    if exists (select 1 from information_schema.schemata where schema_name = 'storage') then
        insert into storage.buckets (id, name, public)
        values ('driver-resumes', 'driver-resumes', false)
        on conflict (id) do nothing;
    end if;
end
$$;
