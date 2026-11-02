-- =====================================================================
-- ANDI TANI (TEMAN HIJAU) - SKEMA DATABASE FASE 1
-- Target  : Supabase PostgreSQL
-- Jalankan: Supabase Dashboard > SQL Editor > New query > Run
-- =====================================================================


-- =====================================================================
-- 1. TABEL
-- =====================================================================

-- 1.1 Users (profil, terhubung ke auth.users)
create table public.users (
  id              uuid primary key references auth.users (id) on delete cascade,
  full_name       text,
  phone_number    text,
  role            text not null default 'customer'
                  check (role in ('admin', 'customer')),
  -- Alamat default pelanggan (disalin ke orders saat checkout)
  province        text,
  city            text,
  district        text,
  postal_code     text,
  address_detail  text,
  created_at      timestamptz not null default now()
);

-- 1.2 Categories
create table public.categories (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,
  description  text,
  created_at   timestamptz not null default now()
);

-- 1.3 Care Guides
create table public.care_guides (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  light_requirement   text,
  watering_frequency  text,
  fertilizer_type     text,
  difficulty_level    text,
  created_at          timestamptz not null default now()
);

-- 1.4 Products
create table public.products (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  description    text,
  price          integer not null check (price >= 0),
  image_url      text,
  stock          integer not null default 0 check (stock >= 0),
  plant_status   text not null default 'Siap Jual'
                 check (plant_status in ('Siap Jual', 'Karantina', 'Pembibitan', 'Produk Umum')),
  is_active      boolean not null default true,
  category_id    uuid not null references public.categories (id) on delete restrict,
  care_guide_id  uuid references public.care_guides (id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- 1.5 Orders
-- total_amount  = subtotal produk (harga database x jumlah)
-- shipping_cost = ongkir, diisi manual oleh admin saat konfirmasi
create table public.orders (
  id                       uuid primary key default gen_random_uuid(),
  order_code               char(6) not null unique
                           check (order_code ~ '^[A-HJKMNP-Z2-9]{6}$'),
  user_id                  uuid not null references public.users (id) on delete restrict,
  customer_name            text not null,
  customer_phone           text not null,
  shipping_province        text not null,
  shipping_city            text not null,
  shipping_district        text not null,
  shipping_postal_code     text not null,
  shipping_address_detail  text not null,
  total_amount             integer not null check (total_amount >= 0),
  shipping_cost            integer not null default 0 check (shipping_cost >= 0),
  status                   text not null default 'pending'
                           check (status in ('pending', 'completed', 'cancelled')),
  created_at               timestamptz not null default now()
);

-- 1.6 Order Items
create table public.order_items (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references public.orders (id) on delete cascade,
  product_id     uuid not null references public.products (id) on delete restrict,
  quantity       integer not null check (quantity > 0),
  price_at_time  integer not null check (price_at_time >= 0),
  unique (order_id, product_id)
);


-- =====================================================================
-- 2. INDEX
-- =====================================================================
create index products_category_idx    on public.products (category_id);
create index products_catalog_idx     on public.products (is_active, plant_status, created_at desc);
create index orders_user_idx          on public.orders (user_id, created_at desc);
create index orders_status_idx        on public.orders (status, created_at desc);
create index order_items_order_idx    on public.order_items (order_id);


-- =====================================================================
-- 3. FUNGSI BANTU & TRIGGER
-- =====================================================================

-- 3.1 Cek apakah user saat ini admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 3.2 Trigger: buat profil otomatis saat user baru mendaftar
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, full_name, phone_number)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'phone_number'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3.3 Trigger: pelanggan tidak boleh mengubah role sendiri.
-- Pengecualian: SQL Editor / service role (auth.uid() bernilai null),
-- sehingga admin pertama bisa ditetapkan manual.
create or replace function public.protect_user_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'Anda tidak memiliki izin untuk mengubah role.';
  end if;
  return new;
end;
$$;

create trigger users_protect_role
  before update on public.users
  for each row execute function public.protect_user_role();

-- 3.4 Trigger: updated_at otomatis pada products
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- 3.5 Generator kode order 6 karakter
-- Alfabet tanpa karakter ambigu: 0, O, 1, I, L (31 karakter, +-887 juta kombinasi).
-- Keunikan dijamin oleh constraint UNIQUE + perulangan di create_order().
create or replace function public.generate_order_code()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  chars  constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  result text := '';
begin
  for i in 1..6 loop
    result := result || substr(chars, 1 + floor(random() * length(chars))::int, 1);
  end loop;
  return result;
end;
$$;


-- =====================================================================
-- 4. RPC TRANSAKSI
-- =====================================================================

-- 4.1 create_order: dipanggil pelanggan saat checkout.
-- Input : [{"product_id": "<uuid>", "quantity": 2}, ...]
-- Harga & total dihitung dari database, bukan dari browser.
-- Stok TIDAK dikurangi di sini (hanya saat admin konfirmasi).
create or replace function public.create_order(p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid       uuid := auth.uid();
  v_user      public.users%rowtype;
  v_order_id  uuid;
  v_code      text;
  v_total     integer;
  v_invalid   text;
  v_attempt   integer := 0;
begin
  if v_uid is null then
    raise exception 'Silakan login terlebih dahulu.';
  end if;

  select * into v_user from public.users where id = v_uid;
  if not found then
    raise exception 'Profil pengguna tidak ditemukan.';
  end if;

  if coalesce(trim(v_user.full_name), '') = ''
     or coalesce(trim(v_user.phone_number), '') = ''
     or coalesce(trim(v_user.province), '') = ''
     or coalesce(trim(v_user.city), '') = ''
     or coalesce(trim(v_user.district), '') = ''
     or coalesce(trim(v_user.postal_code), '') = ''
     or coalesce(trim(v_user.address_detail), '') = '' then
    raise exception 'Lengkapi nama, nomor HP, dan alamat di profil sebelum checkout.';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Keranjang masih kosong.';
  end if;

  -- Validasi produk
  with req as (
    select (e ->> 'product_id')::uuid as pid,
           sum((e ->> 'quantity')::int)::int as qty
    from jsonb_array_elements(p_items) e
    group by 1
  )
  select string_agg(coalesce(p.name, 'Produk tidak dikenal'), ', ')
  into v_invalid
  from req
  left join public.products p on p.id = req.pid
  where p.id is null
     or not p.is_active
     or p.plant_status not in ('Siap Jual', 'Produk Umum')
     or req.qty <= 0;

  if v_invalid is not null then
    raise exception 'Produk berikut tidak bisa dipesan: %', v_invalid;
  end if;

  -- Hitung subtotal dari harga database
  with req as (
    select (e ->> 'product_id')::uuid as pid,
           sum((e ->> 'quantity')::int)::int as qty
    from jsonb_array_elements(p_items) e
    group by 1
  )
  select sum(p.price * req.qty)::int
  into v_total
  from req
  join public.products p on p.id = req.pid;

  -- Buat order dengan kode unik (ulang jika bentrok)
  loop
    v_code := public.generate_order_code();
    begin
      insert into public.orders (
        order_code, user_id, customer_name, customer_phone,
        shipping_province, shipping_city, shipping_district,
        shipping_postal_code, shipping_address_detail, total_amount
      ) values (
        v_code, v_uid, v_user.full_name, v_user.phone_number,
        v_user.province, v_user.city, v_user.district,
        v_user.postal_code, v_user.address_detail, v_total
      )
      returning id into v_order_id;
      exit;
    exception when unique_violation then
      v_attempt := v_attempt + 1;
      if v_attempt >= 10 then
        raise exception 'Gagal membuat kode pesanan. Silakan coba lagi.';
      end if;
    end;
  end loop;

  -- Simpan item dengan harga saat transaksi
  with req as (
    select (e ->> 'product_id')::uuid as pid,
           sum((e ->> 'quantity')::int)::int as qty
    from jsonb_array_elements(p_items) e
    group by 1
  )
  insert into public.order_items (order_id, product_id, quantity, price_at_time)
  select v_order_id, req.pid, req.qty, p.price
  from req
  join public.products p on p.id = req.pid;

  -- Data untuk menyusun pesan WhatsApp di frontend
  return jsonb_build_object(
    'order_id',     v_order_id,
    'order_code',   v_code,
    'total_amount', v_total,
    'items', (
      select jsonb_agg(jsonb_build_object(
        'name',     p.name,
        'quantity', oi.quantity,
        'price',    oi.price_at_time
      ) order by p.name)
      from public.order_items oi
      join public.products p on p.id = oi.product_id
      where oi.order_id = v_order_id
    )
  );
end;
$$;

-- 4.2 confirm_order: admin menekan "Konfirmasi Pesanan".
-- Ditolak dengan penjelasan jika stok tidak cukup.
create or replace function public.confirm_order(
  p_order_code    text,
  p_shipping_cost integer default 0
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order  public.orders%rowtype;
  v_short  text;
begin
  if not public.is_admin() then
    raise exception 'Akses ditolak. Hanya admin yang dapat mengonfirmasi pesanan.';
  end if;

  if p_shipping_cost is null or p_shipping_cost < 0 then
    raise exception 'Ongkir tidak valid.';
  end if;

  select * into v_order
  from public.orders
  where order_code = upper(trim(p_order_code))
  for update;

  if not found then
    raise exception 'Pesanan dengan kode % tidak ditemukan.', upper(trim(p_order_code));
  end if;

  if v_order.status <> 'pending' then
    raise exception 'Pesanan % sudah berstatus %.', v_order.order_code, v_order.status;
  end if;

  -- Kunci baris produk agar stok tidak berubah selama proses
  perform 1
  from public.products p
  where p.id in (select product_id from public.order_items where order_id = v_order.id)
  order by p.id
  for update;

  select string_agg(
           format('%s (stok tersedia %s, dipesan %s)', p.name, p.stock, oi.quantity),
           '; ' order by p.name)
  into v_short
  from public.order_items oi
  join public.products p on p.id = oi.product_id
  where oi.order_id = v_order.id
    and p.stock < oi.quantity;

  if v_short is not null then
    raise exception 'Konfirmasi ditolak karena stok tidak cukup: %', v_short;
  end if;

  update public.products p
  set stock = p.stock - oi.quantity
  from public.order_items oi
  where oi.order_id = v_order.id
    and p.id = oi.product_id;

  update public.orders
  set status = 'completed',
      shipping_cost = p_shipping_cost
  where id = v_order.id;

  return jsonb_build_object(
    'order_code',    v_order.order_code,
    'status',        'completed',
    'shipping_cost', p_shipping_cost
  );
end;
$$;

-- 4.3 cancel_order: admin membatalkan pesanan.
-- Jika sudah 'completed', stok dikembalikan.
create or replace function public.cancel_order(p_order_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order     public.orders%rowtype;
  v_restored  boolean := false;
begin
  if not public.is_admin() then
    raise exception 'Akses ditolak. Hanya admin yang dapat membatalkan pesanan.';
  end if;

  select * into v_order
  from public.orders
  where order_code = upper(trim(p_order_code))
  for update;

  if not found then
    raise exception 'Pesanan dengan kode % tidak ditemukan.', upper(trim(p_order_code));
  end if;

  if v_order.status = 'cancelled' then
    raise exception 'Pesanan % sudah dibatalkan sebelumnya.', v_order.order_code;
  end if;

  if v_order.status = 'completed' then
    update public.products p
    set stock = p.stock + oi.quantity
    from public.order_items oi
    where oi.order_id = v_order.id
      and p.id = oi.product_id;
    v_restored := true;
  end if;

  update public.orders set status = 'cancelled' where id = v_order.id;

  return jsonb_build_object(
    'order_code',     v_order.order_code,
    'status',         'cancelled',
    'stock_restored', v_restored
  );
end;
$$;

-- 4.4 Hak eksekusi fungsi
revoke execute on function public.generate_order_code()            from public, anon, authenticated;
revoke execute on function public.create_order(jsonb)              from public, anon;
revoke execute on function public.confirm_order(text, integer)     from public, anon;
revoke execute on function public.cancel_order(text)               from public, anon;
grant  execute on function public.create_order(jsonb)              to authenticated;
grant  execute on function public.confirm_order(text, integer)     to authenticated;
grant  execute on function public.cancel_order(text)               to authenticated;


-- =====================================================================
-- 5. ROW LEVEL SECURITY
-- =====================================================================
alter table public.users        enable row level security;
alter table public.categories   enable row level security;
alter table public.care_guides  enable row level security;
alter table public.products     enable row level security;
alter table public.orders       enable row level security;
alter table public.order_items  enable row level security;

-- 5.1 Users
create policy "users_select_own_or_admin" on public.users
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "users_update_own_or_admin" on public.users
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- 5.2 Categories
create policy "categories_public_read" on public.categories
  for select to anon, authenticated
  using (true);

create policy "categories_admin_insert" on public.categories
  for insert to authenticated with check (public.is_admin());
create policy "categories_admin_update" on public.categories
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "categories_admin_delete" on public.categories
  for delete to authenticated using (public.is_admin());

-- 5.3 Care Guides
create policy "care_guides_public_read" on public.care_guides
  for select to anon, authenticated
  using (true);

create policy "care_guides_admin_insert" on public.care_guides
  for insert to authenticated with check (public.is_admin());
create policy "care_guides_admin_update" on public.care_guides
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "care_guides_admin_delete" on public.care_guides
  for delete to authenticated using (public.is_admin());

-- 5.4 Products
-- Publik hanya melihat produk aktif berstatus 'Siap Jual' atau 'Produk Umum'.
create policy "products_public_read" on public.products
  for select to anon, authenticated
  using (is_active and plant_status in ('Siap Jual', 'Produk Umum'));

create policy "products_admin_read_all" on public.products
  for select to authenticated
  using (public.is_admin());

create policy "products_admin_insert" on public.products
  for insert to authenticated with check (public.is_admin());
create policy "products_admin_update" on public.products
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "products_admin_delete" on public.products
  for delete to authenticated using (public.is_admin());

-- 5.5 Orders (insert/update hanya lewat RPC di bagian 4)
create policy "orders_select_own_or_admin" on public.orders
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- 5.6 Order Items (insert hanya lewat RPC)
create policy "order_items_select_own_or_admin" on public.order_items
  for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );


-- =====================================================================
-- 6. SUPABASE STORAGE
-- Bucket publik. Gambar dikonversi ke WebP di browser admin sebelum upload,
-- dengan pola nama: <product_id>/full.webp dan <product_id>/thumb.webp
-- =====================================================================
insert into storage.buckets (id, name, public, allowed_mime_types)
values ('product-images', 'product-images', true, array['image/webp'])
on conflict (id) do nothing;

-- Bucket publik sudah bisa dibaca lewat URL publik tanpa policy SELECT.
-- SELECT dibatasi ke admin agar daftar file tidak bisa ditelusuri publik
-- (tetap dibutuhkan admin untuk upload dengan upsert).
create policy "product_images_admin_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());


-- =====================================================================
-- 7. DATA AWAL KATEGORI
-- =====================================================================
insert into public.categories (name, description) values
  ('Tanaman Hias',  'Bunga & daun warna-warni'),
  ('Aglaonema',     'Si cantik penghias ruangan'),
  ('Tanaman Obat',  'Herbal untuk pekarangan'),
  ('Buah & Rempah', 'Panen sendiri dari pot'),
  ('Pot',           'Biar makin manis'),
  ('Pupuk',         'Biar subur & lebat'),
  ('Pembasmi Hama', 'Lindungi dari hama'),
  ('Media Tanam',   'Siap pakai untuk menanam');


-- =====================================================================
-- 8. MENETAPKAN ADMIN PERTAMA (jalankan setelah akun admin mendaftar)
-- =====================================================================
-- update public.users set role = 'admin'
-- where id = (select id from auth.users where email = 'email-admin@contoh.com');
