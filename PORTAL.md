# Pharmacy portal and admin app

Partner pharmacies log in at `/login`, send delivery requests at `/portal`, and see their deliveries, pricing and how-to.
QuickMed staff use `/admin` to see every delivery, mark stops complete, manage clients (mini CRM) and onboard new pharmacies.

## How it fits together

- **Same Next.js app as the marketing site.** Portal code and the Supabase library load only on portal routes, so the public pages ship the same JavaScript as before.
- **Supabase (Postgres + Auth) in Canada (Central).** The browser talks to it directly over HTTPS; patient data never passes through Vercel.
- **Row-level security** in `supabase/migrations/0001_portal.sql` decides who sees what. A pharmacy login only ever reads its own pharmacy's rows; only staff read across pharmacies or change status. Pharmacies submit through the `submit_delivery_request` function, never direct inserts.
- **One server route**, `POST /api/admin/clients`, uses the service-role key to invite a pharmacy login. It checks the caller is staff first.

## One-time setup

1. **Create a Supabase project** at supabase.com. Region: **Canada (Central)**. Save the database password somewhere safe.
2. **Run the schema.** In the dashboard, open SQL Editor, paste `supabase/migrations/0001_portal.sql`, run it.
3. **Auth settings** (Authentication → Providers / Sign In / URL Configuration):
   - Email provider on; **turn "Allow new users to sign up" off** (accounts are invite-only).
   - Minimum password length 12.
   - Site URL `https://quickmed.ca`; add `https://quickmed.ca/set-password` and `http://localhost:3000/set-password` to Redirect URLs.
4. **Email sending** (Authentication → Emails → SMTP Settings). Supabase's built-in sender is for testing only. Use Resend (resend.com) or Amazon SES in `ca-central-1`, and add their DNS records to quickmed.ca. Optionally edit the "Invite user" template, e.g. subject "Your QuickMed pharmacy portal login".
5. **Retention job.** Database → Extensions → enable `pg_cron`, then in SQL Editor:
   ```sql
   select cron.schedule('purge-patient-details', '0 8 * * *', $$select public.purge_patient_details(180)$$);
   ```
   This blanks patient name, street, postal code and phone 180 days after a stop is completed or cancelled.
6. **Vercel environment variables** (Project → Settings → Environment Variables), from Supabase Settings → API. See `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (secret; server only)
7. **First staff login.** Authentication → Users → "Invite user" with your email. Then in SQL Editor:
   ```sql
   insert into public.profiles (id, role, full_name, email)
   select id, 'staff', 'Your Name', email from auth.users where email = 'you@quickmed.ca';
   ```
   Accept the invite email, set a password, and you land in `/admin`. From there, onboard pharmacies with "Onboard a client".

## Local development

```bash
cp .env.example .env.local   # fill in values
npm run dev
```

Without the env vars the marketing site runs normally and the portal shows "Portal not connected".

## Privacy checklist outside the code

- Written agent agreement with each pharmacy (what QuickMed does with patient info, safeguards, breach notice).
- A named privacy contact, and the `/privacy` page reviewed by someone qualified.
- A breach log kept for at least 24 months (PIPEDA).
- Supabase Pro plan once live (daily backups, no auto-pause).
