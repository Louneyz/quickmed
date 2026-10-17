-- Tighten who can call the helper functions directly over the API (flagged by
-- Supabase's security advisor). Policies still work: they run as the signed-in user.
revoke execute on function public.is_staff() from public, anon;
revoke execute on function public.my_pharmacy_id() from public, anon;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.my_pharmacy_id() to authenticated;
revoke execute on function public.on_delivery_status_change() from public, anon, authenticated;
