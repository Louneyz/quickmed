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
   - Minimum password length 10 (the demo password is 10 characters; new pharmacy users are asked for 12).
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
7. **Your staff login and the sales demo.** On your computer, in the repo folder:
   ```bash
   cp .env.example .env.local   # fill in the Supabase values, STAFF_* and DEMO_PASSWORD
   npm install
   npm run setup:portal
   ```
   This creates your `/admin` login (no email needed) and the sales demo login (username `Demo`), and loads the demo's sample deliveries. Run it again any time to reset the demo to a clean state or change either password. From `/admin`, onboard real pharmacies with "Onboard a client".

## Sales demo

- Log in at `/login` with username `Demo` and the `DEMO_PASSWORD` you set. It is a normal pharmacy account flagged `is_demo`, so the database never shows it real clients' data.
- Its sample deliveries are made up. A banner reminds salespeople not to type real patient details.
- Its requests are hidden from the staff Deliveries board and counts; they appear only on the demo's own client page, tagged "Demo" in Clients.
- Re-run `npm run setup:portal` after a demo to wipe what was entered and reload the samples.

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
