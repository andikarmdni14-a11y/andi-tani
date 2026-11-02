-- Rekomendasi Supabase Security Advisor.
-- Fungsi trigger tidak perlu dipanggil lewat API
revoke execute on function public.handle_new_user()   from public, anon, authenticated;
revoke execute on function public.protect_user_role() from public, anon, authenticated;
-- is_admin hanya relevan untuk user yang login
revoke execute on function public.is_admin() from public, anon;
grant  execute on function public.is_admin() to authenticated;
