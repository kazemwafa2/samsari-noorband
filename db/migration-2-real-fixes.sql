-- =====================================================================
-- migration-2-real-fixes.sql
-- =====================================================================
-- این فایل بر اساس Policyها و ستون‌های *واقعی* دیتابیس زنده‌ات نوشته
-- شده — دقیقاً همان چیزی که با کوئری از pg_policies و
-- information_schema.columns بیرون کشیدیم، نه فرضیات schema.sql.
-- همه‌ی دستورها idempotent هستند (drop if exists قبل از هر create) —
-- یعنی اگر دوباره هم اجرا کنی خطا نمی‌دهد.
--
-- این اسکریپت هیچ جدول/داده‌ای را حذف نمی‌کند؛ فقط Policyها را عوض
-- می‌کند و یک ستون (products.seller_id) و یک trigger اضافه می‌کند.
-- کل این فایل را در Supabase → SQL Editor کپی و یک‌جا اجرا کن.
-- =====================================================================


-- ---------------------------------------------------------------------
-- ۱) products: ستون seller_id + محدودکردن نوشتن به مالک محصول
-- ---------------------------------------------------------------------
alter table products add column if not exists seller_id uuid references profiles(id) on delete set null;
create index if not exists idx_products_seller on products(seller_id);

drop policy if exists "products_admin_write" on products;
drop policy if exists "products_admin_all" on products;
drop policy if exists "products_seller_insert" on products;
drop policy if exists "products_seller_update" on products;
drop policy if exists "products_seller_delete" on products;

create policy "products_admin_all" on products
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  )
  with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

create policy "products_seller_insert" on products
  for insert to authenticated
  with check (
    seller_id = auth.uid()
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'seller')
  );

create policy "products_seller_update" on products
  for update to authenticated
  using (
    seller_id = auth.uid()
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'seller')
  )
  with check (seller_id = auth.uid());

create policy "products_seller_delete" on products
  for delete to authenticated
  using (
    seller_id = auth.uid()
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'seller')
  );

-- products_public_read دست نمی‌خورد — همان قبلی درست بود.


-- ---------------------------------------------------------------------
-- ۲) product_images: محدود به مالک محصول (از طریق join)
-- ---------------------------------------------------------------------
drop policy if exists "product_images_admin_write" on product_images;
drop policy if exists "product_images_admin_all" on product_images;
drop policy if exists "product_images_seller_write" on product_images;

create policy "product_images_admin_all" on product_images
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  )
  with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

create policy "product_images_seller_write" on product_images
  for all to authenticated
  using (
    exists (
      select 1 from products pr
      where pr.id = product_images.product_id and pr.seller_id = auth.uid()
    )
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'seller')
  )
  with check (
    exists (
      select 1 from products pr
      where pr.id = product_images.product_id and pr.seller_id = auth.uid()
    )
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'seller')
  );


-- ---------------------------------------------------------------------
-- ۳) product_pawn_details: قبلا با pawn_details_public_read (using true)
--    شماره سریال، IMEI، و نام/شماره تماس مالک قبلی برای *همه* (حتی
--    کاربر مهمان) عمومی بود. حذف کامل دسترسی عمومی + محدود به مالک.
-- ---------------------------------------------------------------------
drop policy if exists "pawn_details_public_read" on product_pawn_details;
drop policy if exists "pawn_details_admin_write" on product_pawn_details;
drop policy if exists "pawn_details_admin_read" on product_pawn_details;
drop policy if exists "pawn_details_seller_read" on product_pawn_details;
drop policy if exists "pawn_details_seller_write" on product_pawn_details;

create policy "pawn_details_admin_read" on product_pawn_details
  for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

create policy "pawn_details_seller_read" on product_pawn_details
  for select to authenticated
  using (
    exists (
      select 1 from products pr
      where pr.id = product_pawn_details.product_id and pr.seller_id = auth.uid()
    )
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'seller')
  );

create policy "pawn_details_admin_write" on product_pawn_details
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  )
  with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

create policy "pawn_details_seller_write" on product_pawn_details
  for all to authenticated
  using (
    exists (
      select 1 from products pr
      where pr.id = product_pawn_details.product_id and pr.seller_id = auth.uid()
    )
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'seller')
  )
  with check (
    exists (
      select 1 from products pr
      where pr.id = product_pawn_details.product_id and pr.seller_id = auth.uid()
    )
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'seller')
  );


-- ---------------------------------------------------------------------
-- ۴) brands / categories: بین همه فروشنده‌ها مشترک‌اند، پس فقط ساختن
--    مورد جدید برای seller باز است؛ ویرایش/حذف موارد موجود فقط ادمین.
-- ---------------------------------------------------------------------
drop policy if exists "brands_admin_write" on brands;
drop policy if exists "brands_admin_all" on brands;
drop policy if exists "brands_seller_insert" on brands;

create policy "brands_admin_all" on brands
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  )
  with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

create policy "brands_seller_insert" on brands
  for insert to authenticated
  with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'seller')
  );

drop policy if exists "categories_admin_write" on categories;
drop policy if exists "categories_admin_all" on categories;
drop policy if exists "categories_seller_insert" on categories;

create policy "categories_admin_all" on categories
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  )
  with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

create policy "categories_seller_insert" on categories
  for insert to authenticated
  with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'seller')
  );


-- ---------------------------------------------------------------------
-- ۵) profiles: جلوگیری از ترفیع نقش توسط خود کاربر + باز کردن دسترسی
--    ادمین برای ویرایش پروفایل بقیه (که اصلا وجود نداشت)
-- ---------------------------------------------------------------------
drop policy if exists "profiles_admin_write" on profiles;
create policy "profiles_admin_write" on profiles
  for update to authenticated
  using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  )
  with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

-- profiles_select_own_or_admin و profiles_update_own دست نمی‌خورند —
-- فقط این trigger اضافه می‌شود تا وقتی خود کاربر (نه ادمین) پروفایل
-- خودش را ویرایش می‌کند، role و is_active همیشه به مقدار قبلی برگردد
-- (یعنی نتواند خودش را admin کند یا is_active=false را دور بزند).
create or replace function prevent_self_role_escalation()
returns trigger as $$
begin
  if auth.uid() = old.id
     and not exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')) then
    new.role := old.role;
    new.is_active := old.is_active;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_prevent_self_role_escalation on profiles;
create trigger trg_prevent_self_role_escalation
  before update on profiles
  for each row execute function prevent_self_role_escalation();


-- ---------------------------------------------------------------------
-- ۶) باکت Storage «images» (عکس محصول/دسته‌بندی/برندینگ/بنر) — قبلا
--    فقط authenticated بودن چک می‌شد، بدون توجه به نقش یا مالکیت.
-- ---------------------------------------------------------------------
drop policy if exists "images_authenticated_upload" on storage.objects;
drop policy if exists "images_authenticated_update" on storage.objects;
drop policy if exists "images_authenticated_delete" on storage.objects;
drop policy if exists "images_products_admin_write" on storage.objects;
drop policy if exists "images_products_seller_write" on storage.objects;
drop policy if exists "images_categories_write" on storage.objects;
drop policy if exists "images_site_assets_write" on storage.objects;

create policy "images_products_admin_write" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'images'
    and (storage.foldername(name))[1] = 'products'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  )
  with check (
    bucket_id = 'images'
    and (storage.foldername(name))[1] = 'products'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

create policy "images_products_seller_write" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'images'
    and (storage.foldername(name))[1] = 'products'
    and (storage.foldername(name))[2] = auth.uid()::text
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'seller')
  )
  with check (
    bucket_id = 'images'
    and (storage.foldername(name))[1] = 'products'
    and (storage.foldername(name))[2] = auth.uid()::text
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'seller')
  );

create policy "images_categories_write" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'images'
    and (storage.foldername(name))[1] = 'categories'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin','seller'))
  )
  with check (
    bucket_id = 'images'
    and (storage.foldername(name))[1] = 'categories'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin','seller'))
  );

create policy "images_site_assets_write" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'images'
    and (storage.foldername(name))[1] in ('branding','banners')
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  )
  with check (
    bucket_id = 'images'
    and (storage.foldername(name))[1] in ('branding','banners')
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

-- images_public_read (bucket_id='images') دست نمی‌خورد — همان قبلی درست بود.


-- ---------------------------------------------------------------------
-- ۷) باکت Storage «avatars» — از قبل تا حدی درست تنظیم شده بود:
--    - "Anyone can view avatars" (SELECT) → درست، دست‌نخورده می‌ماند.
--    - "Users upload own avatar" (INSERT) → درست چک می‌کرد
--      auth.uid() = پوشه‌ی اول مسیر، دست‌نخورده می‌ماند.
--    - "Users update own avatar" (UPDATE) → فقط bucket_id='avatars'
--      چک می‌شد، بدون چک مالکیت! یعنی هر کاربر لاگین‌شده می‌توانست
--      آواتار *هر کاربر دیگری* را overwrite کند. همین‌جا اصلاح می‌شود.
--    - Policy برای DELETE اصلا وجود نداشت — یعنی کاربر نمی‌توانست
--      آواتار خودش را پاک کند. اضافه می‌شود.
-- ---------------------------------------------------------------------
drop policy if exists "Users update own avatar" on storage.objects;
create policy "Users update own avatar" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (auth.uid())::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'avatars'
    and (auth.uid())::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users delete own avatar" on storage.objects;
create policy "Users delete own avatar" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (auth.uid())::text = (storage.foldername(name))[1]
  );

-- "Anyone can view avatars" و "Users upload own avatar" دست نمی‌خورند.
-- =====================================================================
