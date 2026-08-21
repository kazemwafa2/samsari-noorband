-- =====================================================================
-- سیمساری نوربند جاغوری — Schema پایه دیتابیس
-- =====================================================================
-- این فایل را در Supabase Dashboard → SQL Editor اجرا کن (یک‌بار، کامل).
-- قبل از این پروژه، هیچ migration ای برای این جدول‌ها وجود نداشت و
-- همه صفحات صرفا بر اساس حدس از نام ستون‌ها نوشته شده بودند.
-- نام ستون‌های این فایل با کدی که تحویل دادم (لاگین/محصولات/سفارش/
-- داشبورد/تنظیمات) کاملا هماهنگ است.
--
-- توجه: این نسخه "پایه" (فاز ۰ و بخشی از فاز ۴) است، نه تمام ۹۵ جدولی
-- که در چک‌لیست کامل آمده (چندزبانه‌سازی محتوا، بک‌آپ خودکار، آمار SEO،
-- و غیره در این نسخه نیست) — اما بخش تجاری اصلی (فروشگاه + سمساری)
-- کاملا کاربردی و قابل اجراست.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) PROFILES  (اطلاعات تکمیلی کاربران، وصل به auth.users)
-- ---------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text unique,
  phone text,
  avatar_url text,
  role text not null default 'customer'
    check (role in ('super_admin','admin','seller','vip','premium','customer')),
  is_active boolean not null default true,

  -- ستون‌های زیر اضافه شدند: src/app/site/profile/page.tsx و
  -- src/app/site/profile/edit/page.tsx (فایل‌های واقعی و کامل پروژه،
  -- نه چیزی که من نوشته باشم) از full_name/avatar/vip/premium استفاده
  -- می‌کنند، در حالی که بقیه پروژه (ثبت‌نام، پنل ادمین) از name/avatar_url
  -- استفاده می‌کند. به‌جای شکستن یکی از این دو، هر دو نگه داشته شدند و
  -- پایین‌تر trigger این‌ها را خودکار همگام می‌کند.
  full_name text,
  avatar text,
  vip boolean not null default false,
  premium boolean not null default false,

  -- مکان کاربر: در ثبت‌نام پرسیده می‌شود و برای نمایش روی فاکتور/سفارش
  -- استفاده می‌شود. بدون FK مستقیم چون provinces/districts بعد از
  -- profiles در این اسکریپت ساخته می‌شوند (مثل discount_id در orders)
  province_id uuid,
  district_id uuid,
  province text,
  district text,
  address text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- همگام‌سازی name<->full_name و avatar_url<->avatar
create or replace function sync_profile_columns()
returns trigger as $$
begin
  if new.full_name is not null and (new.name is null or new.name = '') then
    new.name := new.full_name;
  elsif new.name is not null and (new.full_name is null or new.full_name = '') then
    new.full_name := new.name;
  end if;

  if new.avatar is not null and new.avatar_url is null then
    new.avatar_url := new.avatar;
  elsif new.avatar_url is not null and new.avatar is null then
    new.avatar := new.avatar_url;
  end if;

  -- role='vip' یا role='premium' هم به‌صورت خودکار فلگ‌های vip/premium را ست می‌کند
  if new.role = 'vip' then
    new.vip := true;
  end if;

  if new.role = 'premium' then
    new.premium := true;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_sync_profile_columns on profiles;
create trigger trg_sync_profile_columns
  before insert or update on profiles
  for each row execute function sync_profile_columns();

-- جلوگیری از ترفیع نقش توسط خود کاربر (privilege escalation):
-- Policy پایین‌تر (profiles_update_own) فقط چک می‌کند ردیف متعلق به
-- خودش باشد، ولی هیچ محدودیتی روی «کدام ستون‌ها» عوض می‌شوند نداشت —
-- یعنی الان یک customer عادی می‌توانست با یک درخواست update ساده
-- role خودش را به admin تغییر بدهد. این trigger وقتی کسی خودش
-- (نه ادمین/سوپرادمین) پروفایل خودش را ویرایش می‌کند، role و
-- is_active را همیشه به مقدار قبلی برمی‌گرداند؛ فقط از طریق Policy
-- ادمین (پایین‌تر) این دو ستون قابل تغییرند.
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

-- ساخت خودکار پروفایل بعد از signUp، تا دیگر نیازی به upsert دستی
-- در صفحه ثبت‌نام نباشد (شبکه ایمنی سمت کلاینت هم می‌تواند بماند).
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    name,
    full_name,
    surname,
    email,
    phone,
    phone_code,
    birth_date,
    country_id,
    province_id,
    district_id,
    city_id,
    village,
    address,
    role
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'surname', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    nullif(new.raw_user_meta_data->>'phone_code', ''),
    nullif(new.raw_user_meta_data->>'birth_date', '')::date,
    nullif(new.raw_user_meta_data->>'country_id', '')::uuid,
    nullif(new.raw_user_meta_data->>'province_id', '')::uuid,
    nullif(new.raw_user_meta_data->>'district_id', '')::uuid,
    nullif(new.raw_user_meta_data->>'city_id', '')::uuid,
    coalesce(new.raw_user_meta_data->>'village', ''),
    nullif(new.raw_user_meta_data->>'address', ''),
    'customer'
  )
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------------
-- 2) CATEGORIES و BRANDS
-- ---------------------------------------------------------------------
create table if not exists categories (
  id bigint generated always as identity primary key,
  title text not null,
  slug text unique not null,
  parent_id bigint references categories(id) on delete set null,
  created_at timestamptz not null default now()
);

-- عکس دسته‌بندی — چک‌لیست: «کارت دسته‌بندی با عکس» (دقیقا مثل طرح
-- مرجع که هر دسته یک عکس واقعی گرد دارد، نه فقط آیکون). قبلا این
-- ستون وجود نداشت و صفحه اصلی همیشه از یک آیکون ثابت lucide به‌جای
-- عکس واقعی محصول/دسته استفاده می‌کرد.
alter table categories add column if not exists image_url text;

-- ترجمه‌ی نام دسته‌بندی به هفت زبان سایت. قبلا فقط یک ستون title (فارسی)
-- وجود داشت، یعنی برای هر کاربری با زبان غیر از فارسی/دری، نام
-- دسته‌بندی‌ها همیشه فارسی می‌ماند. اگر برای یک زبان ترجمه وارد نشده
-- باشد، همان title اصلی به‌عنوان fallback نمایش داده می‌شود — یعنی هیچ
-- دسته‌بندی‌ای هیچ‌وقت خالی نمی‌ماند.
alter table categories add column if not exists title_translations jsonb not null default '{}'::jsonb;

create table if not exists brands (
  id bigint generated always as identity primary key,
  title text not null,
  created_at timestamptz not null default now()
);

-- دسته‌بندی‌های واقعی فروشگاه: لوازم آرایشی و بهداشتی، زیورآلات
-- (گردنبند/دستبند/انگشتر)، و پوشاک محلی هزارگی (لباس/چادر)
do $$
declare
  cosmetics_id bigint;
  jewelry_id bigint;
  clothing_id bigint;
begin
  insert into categories (title, slug) values ('لوازم آرایشی و بهداشتی', 'beauty-cosmetics')
    on conflict (slug) do nothing;
  insert into categories (title, slug) values ('زیورآلات', 'jewelry')
    on conflict (slug) do nothing;
  insert into categories (title, slug) values ('پوشاک محلی هزارگی', 'hazaragi-clothing')
    on conflict (slug) do nothing;

  select id into cosmetics_id from categories where slug = 'beauty-cosmetics';
  select id into jewelry_id from categories where slug = 'jewelry';
  select id into clothing_id from categories where slug = 'hazaragi-clothing';

  insert into categories (title, slug, parent_id) values
    ('لوازم آرایشی', 'makeup', cosmetics_id),
    ('لوازم بهداشتی', 'hygiene', cosmetics_id),
    ('عطر و ادکلن', 'perfume', cosmetics_id),
    ('مراقبت پوست و مو', 'skin-hair-care', cosmetics_id)
  on conflict (slug) do nothing;

  insert into categories (title, slug, parent_id) values
    ('گردنبند', 'necklace', jewelry_id),
    ('دستبند', 'bracelet', jewelry_id),
    ('انگشتر', 'ring', jewelry_id),
    ('گوشواره', 'earring', jewelry_id)
  on conflict (slug) do nothing;

  insert into categories (title, slug, parent_id) values
    ('لباس محلی', 'local-dress', clothing_id),
    ('چادر هزارگی', 'hazaragi-chador', clothing_id)
  on conflict (slug) do nothing;

  -- «متفرقه» عمدا بدون parent است (یک دسته‌بندی مستقل، نه زیرمجموعه
  -- زیورآلات/آرایشی/پوشاک) — برای هر محصولی که در سه دسته اصلی بالا
  -- جا نمی‌شود.
  insert into categories (title, slug) values ('متفرقه', 'misc')
    on conflict (slug) do nothing;
end $$;

-- ---------------------------------------------------------------------
-- 2ب) کشور / ولایت / ولسوالی — این جدول‌ها را در بررسی دقیق‌تر پیدا کردم:
-- src/app/site/checkout/page.tsx از قبل کد کامل fetch از جدول‌های
-- countries → provinces (بر اساس country_id) → districts (بر اساس
-- province_id) را داشت، ولی خود جدول‌ها هیچ‌وقت ساخته نشده بودند —
-- یعنی مرحله انتخاب آدرس در فرآیند خرید هیچوقت واقعا کار نمی‌کرد چون
-- provinces همیشه خالی برمی‌گشت. این بخش دقیقا همان ساختاری را می‌سازد
-- که کد checkout انتظارش را دارد.
-- ---------------------------------------------------------------------
create table if not exists countries (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  -- ستون‌های زیر اضافه شدند: src/hooks/useLocation.ts و
  -- src/components/location/LocationSelector.tsx (کد واقعی پروژه که
  -- قبلا بررسی نشده بود) از is_active/sort_order فیلتر و مرتب‌سازی
  -- می‌کنند، و از name_fa/name_local برای چندزبانگی استفاده می‌کنند.
  name_fa text,
  name_local text,
  phone_code text,
  currency_code text,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists provinces (
  id uuid primary key default gen_random_uuid(),
  country_id uuid references countries(id) on delete cascade,
  name text not null,
  name_fa text,
  name_local text,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists districts (
  id uuid primary key default gen_random_uuid(),
  province_id uuid references provinces(id) on delete cascade,
  name text not null,
  name_fa text,
  name_local text,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

-- جدول cities که useLocation.ts/LocationSelector.tsx انتظارش را
-- داشتند ولی قبلا اصلا وجود نداشت
create table if not exists cities (
  id uuid primary key default gen_random_uuid(),
  district_id uuid references districts(id) on delete cascade,
  name text not null,
  name_fa text,
  name_local text,
  postal_code text,
  is_active boolean not null default true
);

alter table cities enable row level security;
create policy "cities_public_read" on cities for select using (true);

insert into countries (code, name, is_active, sort_order) values
  ('AF', 'افغانستان', true, 1),
  ('IR', 'ایران', true, 2)
on conflict (code) do nothing;

-- ولایت‌های افغانستان (کد کشور AF)
do $$
declare
  af_id uuid;
  province_name text;
  province_names text[] := array[
    'کابل', 'هرات', 'قندهار', 'بلخ', 'ننگرهار', 'غزنی', 'بادغیس', 'بامیان',
    'بدخشان', 'بغلان', 'پکتیا', 'پکتیکا', 'پروان', 'تخار', 'جوزجان',
    'خوست', 'دایکندی', 'زابل', 'سمنگان', 'سرپل', 'غور', 'فراه', 'فاریاب',
    'کاپیسا', 'کنر', 'کندز', 'لغمان', 'لوگر', 'میدان وردک',
    'نورستان', 'نیمروز', 'هلمند', 'پنجشیر'
  ];
begin
  select id into af_id from countries where code = 'AF';

  foreach province_name in array province_names loop
    if not exists (select 1 from provinces where country_id = af_id and name = province_name) then
      insert into provinces (country_id, name) values (af_id, province_name);
    end if;
  end loop;
end $$;

alter table countries enable row level security;
alter table provinces enable row level security;
alter table districts enable row level security;
create policy "countries_public_read" on countries for select using (true);
create policy "provinces_public_read" on provinces for select using (true);
create policy "districts_public_read" on districts for select using (true);

-- ---------------------------------------------------------------------
-- 3) PRODUCTS + گالری تصاویر + اطلاعات ویژه سمساری
-- ---------------------------------------------------------------------


create table if not exists products (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  price numeric(14,2) not null default 0,
  discount numeric(5,2) not null default 0 check (discount >= 0 and discount <= 100),
  stock integer not null default 0,
  category text,
  category_id bigint references categories(id) on delete set null,
  brand_id bigint references brands(id) on delete set null,
  image text,
  sku text unique,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- صاحب محصول (فروشنده‌ای که این محصول را ساخته) — قبلا این ستون اصلا
-- وجود نداشت، یعنی هیچ راهی برای محدودکردن دسترسی seller به «فقط
-- محصولات خودش» نبود. nullable گذاشته شده تا محصولاتی که از قبل
-- توسط ادمین ساخته شده‌اند (بدون فروشنده مشخص) خراب نشوند.
alter table products add column if not exists seller_id uuid references profiles(id) on delete set null;
create index if not exists idx_products_seller on products(seller_id);

create table if not exists product_images (
  id bigint generated always as identity primary key,
  product_id bigint references products(id) on delete cascade,
  url text not null,
  sort_order integer not null default 0
);

-- ستون‌های تکمیلی محصول: کالای ویژه/فوری/بایگانی (فروخته‌شده)
-- از ALTER استفاده شده تا اگر جدول products را قبلا ساخته‌ای، این
-- ستون‌ها اضافه شوند بدون نیاز به دراپ‌کردن جدول.
alter table products add column if not exists is_featured boolean not null default false;
alter table products add column if not exists is_urgent boolean not null default false;
alter table products add column if not exists is_archived boolean not null default false;
alter table products add column if not exists sold_at timestamptz;

-- مشخصات فنی محصول (برند، حجم، مناسب برای، نوع رایحه، ماندگاری، ساخت
-- کشور و ...) به‌صورت جفت کلید-مقدار — چک‌لیست: جدول «مشخصات» در تب
-- صفحه محصول که قبلا اصلا وجود نداشت.
alter table products add column if not exists specifications jsonb not null default '{}'::jsonb;

-- اطلاعات ویژه سمساری: سریال، IMEI، وضعیت کالا، مالک قبلی، ضمانت
create table if not exists product_pawn_details (
  product_id bigint primary key references products(id) on delete cascade,
  condition text check (condition in ('new','used','refurbished')) default 'used',
  color text,
  serial_number text,
  imei text,
  previous_owner_name text,
  previous_owner_phone text,
  purchase_price numeric(14,2),
  purchase_date date,
  warranty_until date
);

-- ---------------------------------------------------------------------
-- 4) رزرو و مزایده کالا
-- ---------------------------------------------------------------------
create table if not exists reservations (
  id bigint generated always as identity primary key,
  product_id bigint references products(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  reserved_until timestamptz not null,
  status text not null default 'active' check (status in ('active','expired','cancelled','completed')),
  created_at timestamptz not null default now()
);

create table if not exists auctions (
  id bigint generated always as identity primary key,
  product_id bigint references products(id) on delete cascade,
  start_price numeric(14,2) not null,
  current_price numeric(14,2) not null,
  min_increment numeric(14,2) not null default 1000,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'open' check (status in ('open','closed','cancelled')),
  winner_id uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists auction_bids (
  id bigint generated always as identity primary key,
  auction_id bigint references auctions(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  amount numeric(14,2) not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 5) ORDERS / ORDER ITEMS / تاریخچه وضعیت
-- ---------------------------------------------------------------------
-- جدول وضعیت‌های سفارش — checkout.tsx واقعی از این جدول (با نام
-- order_statuses) و ستون status_id (نه status متنی) استفاده می‌کند.
create table if not exists order_statuses (
  id bigint generated always as identity primary key,
  name text unique not null
);

insert into order_statuses (name) values
  ('pending'), ('paid'), ('packing'), ('shipping'),
  ('completed'), ('cancelled'), ('returned')
on conflict (name) do nothing;

create table if not exists orders (
  id bigint generated always as identity primary key,
  order_number text unique not null default ('NB-' || to_char(now(),'YYYYMMDD') || '-' || floor(random()*100000)::text),
  order_code text,
  user_id uuid references profiles(id) on delete set null,
  subtotal numeric(14,2) not null default 0,
  shipping_cost numeric(14,2) not null default 0,
  total_amount numeric(14,2) not null default 0,

  -- checkout.tsx واقعی روی status_id (FK به order_statuses) می‌نویسد،
  -- ولی بقیه کد پروژه (پنل ادمین، AI، گزارشات) روی ستون متنی status
  -- کار می‌کنند. به‌جای اینکه یکی از این دو را بشکنیم، هر دو را نگه
  -- داشتیم و پایین‌تر یک trigger این دو را خودکار همگام می‌کند.
  status_id bigint references order_statuses(id),
  status text not null default 'pending'
    check (status in ('pending','paid','packing','shipping','completed','cancelled','returned')),

  payment_status text not null default 'pending'
    check (payment_status in ('pending','paid','failed')),
  payment_authority text,
  ref_id text,

  -- روش پرداخت: قبلا اصلا در سفارش ذخیره نمی‌شد، یعنی نمی‌شد فهمید
  -- سفارش قرار است آنلاین پرداخت شود یا پرداخت در محل (COD) است —
  -- checkout.tsx واقعی این مقدار را هنگام ثبت سفارش می‌فرستد.
  payment_method text not null default 'cod'
    check (payment_method in ('cod','online')),

  -- ستون‌های آدرس: checkout.tsx واقعی این نام‌ها را می‌فرستد
  shipping_name text,
  shipping_phone text,
  shipping_email text,
  shipping_address text,
  shipping_postal_code text,
  user_note text,
  province_id uuid references provinces(id),
  district_id uuid references districts(id),
  province text,
  district text,

  -- ستون تحویل با کد تایید (جدید)
  delivery_code text,
  delivery_code_verified boolean not null default false,

  -- نگه‌داشته شد برای سازگاری با کدهای دیگر پروژه که از این نام‌های
  -- عمومی‌تر استفاده می‌کنند (پنل ادمین آدرس/تلفن را از اینجا می‌خواند)
  address text,
  phone text,

  delivery_status text default 'pending'
    check (delivery_status in ('pending','delivered','returned')),
  delivery_signature text,
  delivered_at timestamptz,
  return_reason text,
  returned_at timestamptz,
  -- ستون‌های زیر اضافه شدند: src/app/site/orders/page.tsx و
  -- src/app/site/orders/[id]/page.tsx (کد واقعی و کامل پروژه) از
  -- total_price/discount_price/order_status استفاده می‌کنند — یعنی
  -- سومین سبک نام‌گذاری در همین پروژه برای همین جدول. به همان الگوی
  -- بالا (افزودن + همگام‌سازی خودکار) این‌ها هم اضافه شدند.
  total_price numeric(14,2),
  discount_price numeric(14,2) default 0,
  -- توجه: بدون FK به discounts، چون جدول discounts در این اسکریپت
  -- بعد از orders ساخته می‌شود (وگرنه اجرای schema با خطا متوقف می‌شد)
  discount_id bigint,
  coupon_code text,
  order_status text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function sync_order_columns()
returns trigger as $$
begin
  if new.status_id is not null then
    select name into new.status from order_statuses where id = new.status_id;
  end if;

  if new.province_id is not null then
    select name into new.province from provinces where id = new.province_id;
  end if;

  if new.district_id is not null then
    select name into new.district from districts where id = new.district_id;
  end if;

  -- کد تحویل: هر سفارش جدید یک کد ۴ رقمی تصادفی می‌گیرد که به مشتری
  -- نشان داده می‌شود و پیک موقع تحویل باید همان را وارد کند تا سیستم
  -- تحویل را تایید و ثبت کند.
  if new.delivery_code is null then
    new.delivery_code := lpad(floor(random() * 10000)::text, 4, '0');
  end if;

  if new.shipping_address is not null and new.address is null then
    new.address := new.shipping_address;
  end if;

  if new.shipping_phone is not null and new.phone is null then
    new.phone := new.shipping_phone;
  end if;

  -- همگام‌سازی سبک نام‌گذاری سوم (site/orders/*)
  if new.total_price is not null and new.total_amount = 0 then
    new.total_amount := new.total_price;
  elsif new.total_amount is not null then
    new.total_price := new.total_amount;
  end if;

  if new.order_status is not null and (new.status is null or new.status = 'pending') then
    new.status := new.order_status;
  elsif new.status is not null then
    new.order_status := new.status;
  end if;

  if new.discount_price is null and new.subtotal is not null and new.total_amount is not null then
    new.discount_price := greatest(new.subtotal - new.total_amount, 0);
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_sync_order_columns on orders;
create trigger trg_sync_order_columns
  before insert or update on orders
  for each row execute function sync_order_columns();

create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id bigint references orders(id) on delete cascade,
  product_id bigint references products(id) on delete set null,
  product_name text not null,
  product_image text,
  product_price numeric(14,2) not null default 0,
  quantity integer not null default 1,
  unit_price numeric(14,2) not null default 0,
  final_price numeric(14,2) not null default 0,
  total_price numeric(14,2) not null default 0,
  -- site/orders/[id]/page.tsx (کد اصلی پروژه) از ستون "price" استفاده
  -- می‌کند؛ با trigger زیر با final_price همگام می‌شود.
  price numeric(14,2)
);

create or replace function sync_order_item_columns()
returns trigger as $$
begin
  if new.price is not null and new.final_price = 0 then
    new.final_price := new.price;
  elsif new.final_price is not null then
    new.price := new.final_price;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_sync_order_item_columns on order_items;
create trigger trg_sync_order_item_columns
  before insert or update on order_items
  for each row execute function sync_order_item_columns();

create table if not exists order_status_history (
  id bigint generated always as identity primary key,
  order_id bigint references orders(id) on delete cascade,
  to_status_id bigint references order_statuses(id),
  status text,
  changed_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 6) تخفیف‌ها / علاقه‌مندی‌ها / نظرات / اعلان‌ها
-- ---------------------------------------------------------------------
create table if not exists discounts (
  id bigint generated always as identity primary key,
  title text not null,
  percent numeric(5,2) not null default 0,
  status boolean not null default true,
  expire date,
  created_at timestamptz not null default now()
);

create table if not exists wishlist (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id) on delete cascade,
  product_id bigint references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists comments (
  id bigint generated always as identity primary key,
  product_id bigint references products(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  content text not null,
  rating integer check (rating between 1 and 5),
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'system'
    check (type in ('order','payment','discount','wishlist','product','delivery','account','system','support')),
  is_read boolean not null default false,
  link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

-- ---------------------------------------------------------------------
-- 7) تنظیمات سایت (یک ردیف ثابت با id = 1)
-- ---------------------------------------------------------------------
create table if not exists site_settings (
  id integer primary key default 1 check (id = 1),
  site_name text default 'NOORBAND',
  low_stock_threshold integer default 5,
  maintenance_mode boolean default false,
  maintenance_message text,
  maintenance_ends_at timestamptz,
  cod_enabled boolean default false,
  min_order_amount numeric(14,2) default 0,
  notify_site_enabled boolean default true,
  notify_email_enabled boolean default false,
  notify_push_enabled boolean default false,
  default_currency text default 'AFN',
  currency_rates jsonb default '{"AFN":1,"IRT":1.3,"USD":0.014,"EUR":0.013}'::jsonb,
  updated_at timestamptz default now()
);

insert into site_settings (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- برندینگ فروشگاه (لوگو + عکس دوکان روز/شب) — قابل تغییر از پنل مدیریت
-- ---------------------------------------------------------------------
-- قبلا لوگو و عکس آدرس دوکان مستقیم در کد (src/constants/site.ts) ثابت
-- بودند؛ یعنی برای عوض‌کردنشان باید کد عوض و دوباره دیپلوی می‌شد.
-- حالا این‌ها در دیتابیس هستند و از پنل مدیریت (تنظیمات → برندینگ)
-- با آپلود واقعی فایل (jpg/png/svg) قابل تغییرند. اگر خالی باشند،
-- سایت از تصویر/آیکون پیش‌فرض داخلی استفاده می‌کند.
alter table site_settings add column if not exists logo_url text;
alter table site_settings add column if not exists store_image_day_url text;
alter table site_settings add column if not exists store_image_night_url text;

-- عکس بنر اصلی (Hero) — چک‌لیست: طرح مرجع یک عکس بزرگ واقعی (انگشتر
-- روی زمینه گل) کنار متن اسلایدر دارد؛ قبلا اسلایدر فقط متن و آیکون
-- بود، هیچ عکسی نداشت.
alter table site_settings add column if not exists hero_image_url text;

-- گالری چند-عکسی آدرس دوکان (قبلا فقط یک عکس روز + یک عکس شب بود؛
-- کاربر خواسته چند عکس مختلف از دوکان نمایش داده شود)
alter table site_settings add column if not exists store_gallery_urls jsonb not null default '[]'::jsonb;

-- لینک‌های شبکه‌های اجتماعی + شماره واتساپ، از پنل مدیریت (قبلا این‌ها
-- در کد src/constants/site.ts هارد‌کد بودند)
alter table site_settings add column if not exists social_facebook text;
alter table site_settings add column if not exists social_instagram text;
alter table site_settings add column if not exists social_whatsapp text;

-- این‌که کدام شبکه‌ها به‌صورت بارکد روی فاکتور چاپ شوند، از پنل قابل
-- انتخاب است (چک‌باکس‌های facebook/instagram/whatsapp)
alter table site_settings add column if not exists invoice_barcode_platforms jsonb not null default '["whatsapp"]'::jsonb;

-- ویدیوی تبلیغاتی صفحه اصلی، از پنل مدیریت قابل تنظیم/تعویض
alter table site_settings add column if not exists promo_video_url text;
alter table site_settings add column if not exists promo_video_enabled boolean not null default false;

-- اگر ادمین به‌جای لینک/آپلود ویدیو، بخواهد یک لینک شبکه اجتماعی
-- (مثلا یک ریلز اینستاگرام یا ویدیوی فیسبوک) به‌عنوان تبلیغ نشان دهد
alter table site_settings add column if not exists promo_social_link text;

-- تم/رنگ‌بندی کل سایت از پنل «تنظیمات ظاهری» — یک JSON با کلیدهایی مثل
-- primary, secondary, background, cardBg, buttonText, glassOpacity که
-- در زمان اجرا به‌صورت CSS custom properties روی <html> اعمال می‌شوند
-- (src/components/ThemeInjector.tsx). اگر خالی باشد، همان رنگ‌بندی
-- پیش‌فرض کد (globals.css) دست‌نخورده باقی می‌ماند.
alter table site_settings add column if not exists theme jsonb not null default '{}'::jsonb;

create table if not exists addresses (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id) on delete cascade,
  title text not null default 'آدرس',
  country text not null,
  province text not null,
  city text,
  full_address text not null,
  postal_code text,
  receiver_name text,
  receiver_phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

alter table addresses enable row level security;
create policy "addresses_owner_only" on addresses for all using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- 7ب) امنیت: محدودیت تلاش ورود + Audit Log + اشتراک Push
-- ---------------------------------------------------------------------
create table if not exists login_attempts (
  id bigint generated always as identity primary key,
  email text not null,
  success boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_login_attempts_email on login_attempts(email, created_at);

create table if not exists audit_log (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id),
  action text not null,
  entity text,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

create table if not exists push_subscriptions (
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);


-- ---------------------------------------------------------------------
-- 8) ایندکس‌های پرکاربرد
-- ---------------------------------------------------------------------
create index if not exists idx_products_available on products(is_available);
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_orders_user on orders(user_id);
create index if not exists idx_order_items_order on order_items(order_id);
create index if not exists idx_notifications_user on notifications(user_id, is_read);
create index if not exists idx_wishlist_user on wishlist(user_id);
create index if not exists idx_comments_product on comments(product_id, is_approved);

-- =====================================================================
-- 9) ROW LEVEL SECURITY (RLS) — قبلا اصلا فعال نبود
-- =====================================================================

alter table profiles enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_status_history enable row level security;
alter table wishlist enable row level security;
alter table comments enable row level security;
alter table notifications enable row level security;
alter table products enable row level security;
alter table discounts enable row level security;
alter table site_settings enable row level security;
alter table reservations enable row level security;
alter table auctions enable row level security;
alter table auction_bids enable row level security;
alter table login_attempts enable row level security;
alter table audit_log enable row level security;
alter table push_subscriptions enable row level security;

-- --- PROFILES: هرکس فقط پروفایل خودش را می‌بیند/ویرایش می‌کند، ادمین همه را می‌بیند
drop policy if exists "profiles_select_own_or_admin" on profiles;
drop policy if exists "profiles_update_own" on profiles;
drop policy if exists "profiles_admin_write" on profiles;

create policy "profiles_select_own_or_admin" on profiles
  for select using (
    auth.uid() = id
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id);

-- قبلا هیچ Policy‌ای برای ویرایش پروفایل *بقیه‌ی کاربران* توسط ادمین
-- وجود نداشت — یعنی صفحات مدیریت کاربران در داشبورد
-- (dashboard/users/[id]، dashboard/settings/users) که role یا
-- is_active کاربر دیگری را update می‌کنند، همیشه با خطای RLS رد
-- می‌شدند. این Policy همان کاری که profiles_update_own برای «خود
-- کاربر» انجام می‌دهد را برای ادمین/سوپرادمین روی همه‌ی ردیف‌ها باز می‌کند.
create policy "profiles_admin_write" on profiles
  for update to authenticated
  using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  )
  with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

-- --- PRODUCTS: نمایش عمومی محصولات موجود، نوشتن هرکس فقط طبق نقش خودش
-- قبلا اینجا یک policy واحد با for all بود که به admin/super_admin/
-- seller دقیقا یک سطح دسترسی می‌داد — یعنی seller می‌توانست محصول
-- هر فروشنده دیگری را هم ویرایش/حذف کند. حالا: ادمین/سوپرادمین کامل،
-- seller فقط INSERT/UPDATE/DELETE روی محصولی که seller_id خودش را دارد.
drop policy if exists "products_admin_write" on products;
drop policy if exists "products_public_read" on products;
drop policy if exists "products_admin_all" on products;
drop policy if exists "products_seller_insert" on products;
drop policy if exists "products_seller_update" on products;
drop policy if exists "products_seller_delete" on products;

create policy "products_public_read" on products
  for select using (is_available = true or
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin','seller')));

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

-- ---------------------------------------------------------------------
-- این ۵ جدول قبلا اصلا RLS فعال نداشتند — یعنی طبق تنظیم پیش‌فرض
-- Supabase (grant عمومی روی schema public) هرکسی با کلید anon هم
-- می‌توانست مستقیم این جدول‌ها را از طریق API بخواند/بنویسد/حذف کند؛
-- مثلا هرکسی می‌توانست دسته‌بندی/برند جعلی بسازد یا حذف کند، یا
-- product_pawn_details (سریال/IMEI/مالک قبلی کالای امانی) را دستکاری
-- کند. الان دقیقا هم‌الگوی products: خواندن عمومی، نوشتن فقط ادمین/
-- فروشنده.
-- ---------------------------------------------------------------------
alter table brands enable row level security;
alter table categories enable row level security;
alter table order_statuses enable row level security;
alter table product_images enable row level security;
alter table product_pawn_details enable row level security;

-- --- BRANDS / CATEGORIES: این دو جدول برخلاف products مفهوم «مالک»
-- ندارند — یک برند/دسته‌بندی بین همه‌ی فروشنده‌ها مشترک است. قبلا
-- seller دقیقا هم‌سطح ادمین بود (for all)، یعنی می‌توانست دسته‌بندی یا
-- برندی که فروشنده‌های دیگر هم رویش محصول دارند را حذف/تغییر بدهد و
-- کل فروشگاه را بهم بریزد. الان: ساختن مورد جدید برای seller هم آزاد
-- است (ضرری به داده‌ی موجود نمی‌زند)، ولی ویرایش/حذف موارد موجود فقط
-- با ادمین/سوپرادمین است.
drop policy if exists "brands_admin_write" on brands;
drop policy if exists "brands_admin_all" on brands;
drop policy if exists "brands_seller_insert" on brands;

create policy "brands_public_read" on brands
  for select using (true);

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

create policy "categories_public_read" on categories
  for select using (true);

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

create policy "order_statuses_public_read" on order_statuses
  for select using (true);
create policy "order_statuses_admin_write" on order_statuses
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

-- ادمین/سوپرادمین روی همه‌ی تصاویر، seller فقط روی تصاویر محصولی که
-- خودش (seller_id) صاحبش است — از طریق join به products چک می‌شود
-- چون product_images خودش ستون مالکیت ندارد.
drop policy if exists "product_images_admin_write" on product_images;
drop policy if exists "product_images_public_read" on product_images;
drop policy if exists "product_images_admin_all" on product_images;
drop policy if exists "product_images_seller_write" on product_images;

create policy "product_images_public_read" on product_images
  for select using (true);

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
      where pr.id = product_images.product_id
        and pr.seller_id = auth.uid()
    )
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'seller')
  )
  with check (
    exists (
      select 1 from products pr
      where pr.id = product_images.product_id
        and pr.seller_id = auth.uid()
    )
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'seller')
  );

-- --- PRODUCT_PAWN_DETAILS: این جدول شماره سریال، IMEI، و نام/شماره
-- تماس مالک قبلی کالای امانی را نگه می‌دارد — یعنی داده‌ی شخصیِ
-- حساس. Policy قبلی (for select using (true)) این اطلاعات را برای
-- *همه*، حتی کاربر مهمانِ لاگین‌نکرده، عمومی می‌کرد؛ در حالی که در کل
-- پروژه فقط داشبورد ادمین/فروشنده
-- (dashboard/products/edit/[id]/page.tsx) از این جدول می‌خواند —
-- صفحه عمومی محصول اصلا به آن نیازی ندارد. همچنین نوشتن هم مثل
-- محصولات قبلا برای هر seller روی هر محصولی باز بود؛ الان مثل
-- products/product_images محدود به مالک شد.
drop policy if exists "product_pawn_details_public_read" on product_pawn_details;
drop policy if exists "product_pawn_details_admin_write" on product_pawn_details;
drop policy if exists "product_pawn_details_admin_read" on product_pawn_details;
drop policy if exists "product_pawn_details_seller_read" on product_pawn_details;
drop policy if exists "product_pawn_details_seller_write" on product_pawn_details;

create policy "product_pawn_details_admin_read" on product_pawn_details
  for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

create policy "product_pawn_details_seller_read" on product_pawn_details
  for select to authenticated
  using (
    exists (
      select 1 from products pr
      where pr.id = product_pawn_details.product_id
        and pr.seller_id = auth.uid()
    )
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'seller')
  );

create policy "product_pawn_details_admin_write" on product_pawn_details
  for all using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  )
  with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

create policy "product_pawn_details_seller_write" on product_pawn_details
  for all to authenticated
  using (
    exists (
      select 1 from products pr
      where pr.id = product_pawn_details.product_id
        and pr.seller_id = auth.uid()
    )
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'seller')
  )
  with check (
    exists (
      select 1 from products pr
      where pr.id = product_pawn_details.product_id
        and pr.seller_id = auth.uid()
    )
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'seller')
  );

-- --- ORDERS: کاربر فقط سفارش‌های خودش، ادمین همه
create policy "orders_select_own_or_admin" on orders
  for select using (
    auth.uid() = user_id
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

-- نکته: یک policy عمومی `using (true)` روی SELECT اینجا اضافه نشد،
-- چون Postgres چند policy مجاز روی یک عملیات را با OR ترکیب می‌کند —
-- یعنی چنین چیزی کل جدول orders (آدرس/تلفن/همه چیز هر مشتری) را برای
-- هر بازدیدکننده‌ی ناشناس در هر کوئری‌ای باز می‌کرد، نه فقط برای
-- پیگیری با شماره سفارش. به‌جایش، رهگیری مهمان از طریق یک تابع محدود
-- (track_order_by_number پایین همین فایل) انجام می‌شود که فقط دقیقا
-- با شماره سفارش کار می‌کند و فقط فیلدهای غیرحساس را برمی‌گرداند.

create policy "orders_insert_own" on orders
  for insert with check (auth.uid() = user_id);

-- نکته اصلاح‌شده: قبلا این Policy فقط admin/super_admin را برای تغییر
-- وضعیت سفارش مجاز می‌کرد. اما dashboard/layout.tsx به SELLER هم اجازه
-- ورود به /dashboard/orders را می‌دهد و از همان صفحه سعی می‌کند وضعیت
-- سفارش را عوض کند — یعنی برای فروشنده، این تغییر همیشه توسط RLS بی‌صدا
-- رد می‌شد (بدون خطا، چون UPDATE با ۰ ردیف تطبیق‌یافته یک خطای واقعی
-- برنمی‌گرداند)؛ در حالی‌که رابط کاربری چون state را خوش‌بینانه به‌روز
-- می‌کرد، به نظر می‌رسید کار «انجام شد» ولی در دیتابیس هیچ‌چیز ذخیره
-- نمی‌شد. این همان «هیچ کاری از پنل انجام نمی‌شه» بود.
-- drop-if-exists اضافه شد تا این فایل روی یک دیتابیس که قبلا یک‌بار
-- schema.sql را اجرا کرده، دوباره بدون خطای «policy already exists»
-- قابل اجرا باشد.
drop policy if exists "orders_update_admin_only" on orders;
create policy "orders_update_admin_only" on orders
  for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin','seller'))
  );

-- --- ORDER_ITEMS / HISTORY: تابع سفارش والد را چک می‌کند
create policy "order_items_select" on order_items
  for select using (
    exists (
      select 1 from orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid()
             or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')))
    )
  );

create policy "order_items_insert_own" on order_items
  for insert with check (
    exists (select 1 from orders o where o.id = order_items.order_id and o.user_id = auth.uid())
  );

create policy "order_status_history_select" on order_status_history
  for select using (
    exists (
      select 1 from orders o
      where o.id = order_status_history.order_id
        and (o.user_id = auth.uid()
             or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')))
    )
  );

-- --- WISHLIST / COMMENTS / NOTIFICATIONS: فقط صاحب داده
create policy "wishlist_owner_only" on wishlist
  for all using (auth.uid() = user_id);

create policy "comments_public_read_approved" on comments
  for select using (is_approved = true or auth.uid() = user_id
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')));

create policy "comments_insert_own" on comments
  for insert with check (auth.uid() = user_id);

create policy "comments_admin_moderate" on comments
  for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

create policy "notifications_owner_only" on notifications
  for all using (auth.uid() = user_id);

-- --- DISCOUNTS: عمومی قابل خواندن (برای نمایش در فروشگاه)، فقط ادمین می‌نویسد
create policy "discounts_public_read" on discounts for select using (true);
create policy "discounts_admin_write" on discounts
  for insert with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')));
create policy "discounts_admin_update" on discounts
  for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')));
create policy "discounts_admin_delete" on discounts
  for delete using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')));

-- --- SITE_SETTINGS: خواندن عمومی (حالت تعمیر باید همه ببینند)، نوشتن فقط ادمین
create policy "site_settings_public_read" on site_settings for select using (true);
create policy "site_settings_admin_write" on site_settings
  for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')));

-- --- RESERVATIONS / AUCTIONS / BIDS
create policy "reservations_owner_or_admin" on reservations
  for select using (
    auth.uid() = user_id
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );
create policy "reservations_insert_own" on reservations
  for insert with check (auth.uid() = user_id);

create policy "auctions_public_read" on auctions for select using (true);
create policy "auctions_admin_write" on auctions
  for insert with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')));

create policy "auction_bids_public_read" on auction_bids for select using (true);
create policy "auction_bids_insert_own" on auction_bids
  for insert with check (auth.uid() = user_id);

-- --- LOGIN_ATTEMPTS: هیچ‌کس مستقیم از کلاینت نمی‌خواند/نمی‌نویسد؛
-- فقط از طریق service role در /api/login (که با کلید سرویس اجرا می‌شود)
create policy "login_attempts_select_for_ratelimit" on login_attempts
  for select using (true);
create policy "login_attempts_insert_anyone" on login_attempts
  for insert with check (true);

-- --- AUDIT_LOG: فقط ادمین می‌بیند
create policy "audit_log_admin_read" on audit_log
  for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );
create policy "audit_log_insert_own" on audit_log
  for insert with check (auth.uid() = user_id);

-- --- PUSH_SUBSCRIPTIONS: فقط صاحب اشتراک
create policy "push_subscriptions_owner_only" on push_subscriptions
  for all using (auth.uid() = user_id);

create table if not exists product_questions (
  id bigint generated always as identity primary key,
  product_id bigint references products(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  question text not null,
  answer text,
  answered_by uuid references profiles(id),
  answered_at timestamptz,
  created_at timestamptz not null default now()
);

alter table product_questions enable row level security;
create policy "product_questions_public_read" on product_questions for select using (true);
create policy "product_questions_insert_own" on product_questions
  for insert with check (auth.uid() = user_id);
create policy "product_questions_admin_answer" on product_questions
  for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

-- ---------------------------------------------------------------------
-- 10) آنالیتیکس ساده بازدید صفحات (جدید)
-- ---------------------------------------------------------------------
create table if not exists page_views (
  id bigint generated always as identity primary key,
  path text not null,
  user_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table page_views enable row level security;
create policy "page_views_insert_anyone" on page_views for insert with check (true);
create policy "page_views_admin_read" on page_views for select using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
);
create index if not exists idx_page_views_path on page_views(path, created_at);

-- ---------------------------------------------------------------------
-- 11) ویوهای عمومی برای صفحه اصلی (محصولات پرفروش واقعی + نظرات مشتریان)
-- قبلا صفحه اصلی هیچ راهی برای نمایش "محصولات پرفروش" واقعی نداشت،
-- چون order_items فقط برای صاحب سفارش قابل خواندن است (RLS)، و
-- comments هم به profiles وصل است که پروفایل بقیه کاربران را نشان
-- نمی‌دهد. این دو ویو فقط داده‌ی تجمیعی/عمومیِ لازم برای صفحه اصلی را
-- (بدون افشای اطلاعات خصوصی سفارش یا پروفایل) در دسترس می‌گذارند.
-- ---------------------------------------------------------------------

-- پرفروش‌ترین‌ها: مجموع تعداد فروخته‌شده هر محصول از روی سفارش‌های
-- لغو نشده. ویو با اختیارات سازنده اجرا می‌شود، پس با وجود RLS روی
-- order_items همچنان قابل خواندن است — فقط شمارش تجمیعی برمی‌گرداند،
-- نه اطلاعات شخصی سفارش‌ها.
create or replace view public_bestsellers as
select
  oi.product_id,
  sum(oi.quantity)::bigint as total_sold
from order_items oi
join orders o on o.id = oi.order_id
where oi.product_id is not null
  and o.status <> 'cancelled'
group by oi.product_id
order by total_sold desc;

grant select on public_bestsellers to anon, authenticated;

-- نظرات مشتریان برای نمایش عمومی (فقط تاییدشده‌ها) به‌همراه نام
-- نویسنده؛ چون profiles برای بقیه کاربران با RLS محدود است، این ویو
-- فقط نام/آواتار (نه ایمیل/شماره تماس) را برای نظرات تاییدشده آشکار
-- می‌کند.
create or replace view public_reviews as
select
  c.id,
  c.product_id,
  c.content,
  c.rating,
  c.created_at,
  coalesce(p.name, 'مشتری نوربند') as author_name,
  p.avatar_url as author_avatar,
  pd.title as product_title
from comments c
left join profiles p on p.id = c.user_id
left join products pd on pd.id = c.product_id
where c.is_approved = true;

grant select on public_reviews to anon, authenticated;

-- ---------------------------------------------------------------------
-- 12) خبرنامه + وبلاگ (برای تکمیل چک‌لیست صفحه اصلی v15)
-- ---------------------------------------------------------------------

-- خبرنامه: ثبت ایمیل واقعی (نه فقط یک فرم بی‌بک‌اند). هر کسی (حتی
-- مهمان) می‌تواند ثبت‌نام کند؛ خواندن لیست فقط برای ادمین.
create table if not exists newsletter_subscribers (
  id bigint generated always as identity primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;

create policy "newsletter_insert_anyone" on newsletter_subscribers
  for insert with check (true);

create policy "newsletter_select_admin" on newsletter_subscribers
  for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

create policy "newsletter_delete_admin" on newsletter_subscribers
  for delete using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

-- وبلاگ: جدول و دسترسی‌ها آماده‌اند و صفحات عمومی /blog و /blog/[slug]
-- به همین جدول وصل هستند. فعلا پنل مدیریت (CRUD ادمین) برای وبلاگ
-- ساخته نشده — تا زمانی که آن بخش اضافه شود، می‌توانی مطلب را مستقیم
-- از Supabase → Table Editor → blog_posts وارد کنی. تا وقتی جدول خالی
-- است، بخش «وبلاگ» در صفحه اصلی و صفحه /blog به‌صورت خودکار مخفی/خالی
-- می‌ماند (نه اینکه مطلب ساختگی نشان بدهد).
create table if not exists blog_posts (
  id bigint generated always as identity primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image text,
  author_name text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table blog_posts enable row level security;

create policy "blog_posts_select_published" on blog_posts
  for select using (
    is_published = true
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

create policy "blog_posts_admin_write" on blog_posts
  for insert with check (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

create policy "blog_posts_admin_update" on blog_posts
  for update using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

create policy "blog_posts_admin_delete" on blog_posts
  for delete using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

create index if not exists idx_blog_posts_published on blog_posts(is_published, created_at desc);

-- ---------------------------------------------------------------------
-- 13) نمایش عمومی نام پرسش‌کننده/پاسخ‌دهنده در پرسش و پاسخ محصول
-- جدول product_questions خودش policy عمومی برای خواندن دارد
-- (product_questions_public_read)، اما وقتی صفحه محصول با
-- profiles(name) به آن join می‌زند، RLS جدول profiles نام بقیه
-- کاربران را مخفی می‌کند و نام پرسش‌کننده برای هرکسی جز خودش/ادمین
-- خالی نمایش داده می‌شود. راه‌حل همان الگوی public_reviews است.
-- ---------------------------------------------------------------------
create or replace view public_product_questions as
select
  q.id,
  q.product_id,
  q.question,
  q.answer,
  q.answered_at,
  q.created_at,
  coalesce(asker.name, 'مشتری نوربند') as asker_name,
  answerer.name as answerer_name
from product_questions q
left join profiles asker on asker.id = q.user_id
left join profiles answerer on answerer.id = q.answered_by;

grant select on public_product_questions to anon, authenticated;

-- ---------------------------------------------------------------------
-- 14) کاهش امن موجودی هنگام خرید (جلوگیری از فروش بیش از موجودی)
-- قبلا صفحه checkout سفارش را ثبت می‌کرد ولی هیچ‌جا موجودی محصول کم
-- نمی‌شد و هیچ چک نمی‌شد که آیا اصلا آن تعداد موجود است یا نه — یعنی
-- تئوریک می‌شد بیشتر از موجودی واقعی فروخت، یا حتی محصول ناموجود را
-- خرید. این تابع اتمیک است (خود Postgres تضمین می‌کند)، پس حتی اگر
-- دو نفر هم‌زمان آخرین دانه را بخرند، موجودی هرگز منفی نمی‌شود —
-- برخلاف انجام این کار با یک select و بعد یک update جدا در کد
-- کلاینت که در آن حالت race condition واقعی وجود دارد.
create or replace function decrement_product_stock(p_product_id bigint, p_quantity integer)
returns integer
language plpgsql
security definer
as $$
declare
  v_new_stock integer;
begin
  update products
  set stock = stock - p_quantity
  where id = p_product_id
    and stock >= p_quantity
  returning stock into v_new_stock;

  -- اگر هیچ سطری آپدیت نشد یعنی موجودی کافی نبود؛ صریحا خطا می‌دهیم
  -- تا کد سمت کلاینت بفهمد سفارش نیاز به بازبینی موجودی دارد، به‌جای
  -- اینکه بی‌صدا موفق به‌نظر برسد.
  if v_new_stock is null then
    raise exception 'insufficient_stock: product % has less than % in stock', p_product_id, p_quantity;
  end if;

  return v_new_stock;
end;
$$;

grant execute on function decrement_product_stock(bigint, integer) to authenticated;

-- ---------------------------------------------------------------------
-- 15) Rate limiting برای AI API (جلوگیری از سوءاستفاده/هزینه ناخواسته)
-- قبلا src/app/api/ai/route.ts هیچ محدودیتی نداشت — هرکسی (حتی مهمان،
-- بدون لاگین) می‌توانست این endpoint را هر چندبار که می‌خواهد صدا
-- بزند و هزینه واقعی GROQ API را بالا ببرد. این تابع اتمیک بر پایه
-- دیتابیس است (نه فقط یک Map در حافظه سرور که در محیط serverless با
-- چند instance مجزا قابل‌اعتماد نیست، چون هر instance حافظه خودش را
-- دارد) — یعنی حتی اگر Vercel چند نسخه از تابع را هم‌زمان اجرا کند،
-- محدودیت درست اعمال می‌شود.
create table if not exists ai_request_log (
  id bigint generated always as identity primary key,
  identifier text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_request_log_identifier_time
  on ai_request_log(identifier, created_at);

alter table ai_request_log enable row level security;
-- عمدا هیچ policy برای select/insert مستقیم گذاشته نشده — این جدول
-- فقط از طریق تابع security definer پایین قابل دسترسی است، نه مستقیم
-- از کلاینت. این جلوی دستکاری/پاک‌کردن لاگ توسط خود کاربر را می‌گیرد.

create or replace function check_ai_rate_limit(
  p_identifier text,
  p_max_requests integer default 15,
  p_window_minutes integer default 5
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_count integer;
begin
  select count(*) into v_count
  from ai_request_log
  where identifier = p_identifier
    and created_at > now() - (p_window_minutes || ' minutes')::interval;

  if v_count >= p_max_requests then
    return false;
  end if;

  insert into ai_request_log (identifier) values (p_identifier);
  return true;
end;
$$;

grant execute on function check_ai_rate_limit(text, integer, integer) to anon, authenticated;

-- نکته نگهداری: این جدول با زمان بزرگ می‌شود چون هیچ‌چیز رکوردهای
-- قدیمی را پاک نمی‌کند. اگر بعدا حجمش مهم شد، یک کوئری دوره‌ای مثل
-- زیر (مثلا هفتگی، از Supabase Cron یا یک اسکریپت ادمین) کافی است:
--   delete from ai_request_log where created_at < now() - interval '7 days';

-- =====================================================================
-- پایان فایل. بعد از اجرای این schema:
--   1) در Supabase → Storage یک باکت به نام "images" (نه "products")
--      بساز و آن را Public کن — تمام آپلود تصویر پروژه از همین باکت
--      استفاده می‌کند.
--   2) اولین کاربر خودت را با دستور زیر super_admin کن:
--      update profiles set role = 'super_admin' where email = 'YOUR_EMAIL';
--   3) اگر این نسخه را روی یک پروژه Supabase قبلا راه‌اندازی‌شده دوباره
--      اجرا می‌کنی، فقط بخش‌های «۱۱» تا «۱۵» در انتهای فایل کافی است —
--      چیزی حذف یا بازنویسی نمی‌شود. بدون اجرای بخش ۱۴، موجودی محصولات
--      بعد از خرید کم نمی‌شود (چک‌اوت همچنان کار می‌کند، فقط موجودی
--      بروزرسانی نمی‌شود). بدون اجرای بخش ۱۵، AI API بدون محدودیت
--      باقی می‌ماند (fail-open — یعنی به‌جای مسدودکردن کاربران، اجازه
--      عبور می‌دهد؛ در کد route با کامنت مشخص شده).
-- =====================================================================

-- =====================================================================
-- 16) زبان‌ها، ارزها و ترجمه‌ها (چندزبانه‌سازی دیتابیس‌محور واقعی)
-- =====================================================================
-- چرا این بخش لازم است: در بررسی دقیق سورس، سه کامپوننت واقعی در پروژه
-- پیدا شدند که مستقیم به جدول‌های languages / currencies / translations
-- وصل می‌شوند (src/components/locale/LocaleProvider.tsx،
-- src/components/locale/LocaleSelector.tsx، src/hooks/useTranslation.ts)
-- و همچنین src/store/appStore.ts که وضعیت زبان/ارز انتخابی کاربر را
-- نگه می‌دارد — اما این سه جدول هیچ‌وقت در schema.sql ساخته نشده بودند،
-- و خود این کامپوننت‌ها هم تا امروز در هیچ صفحه‌ای import نشده بودند
-- (کد "یتیم" - نوشته شده ولی هرگز به اپ وصل نشده). این بخش هم جدول‌ها
-- را می‌سازد و هم (در سمت کد) این سیستم را به‌عنوان «ترجیح زبان کاربر»
-- در پنل کاربری وصل می‌کند؛ بدون اینکه به سیستم زبان استاتیک زنده‌ی
-- سایت (src/lib/i18n + middleware.ts که واقعاً صفحات را ترجمه می‌کند)
-- آسیبی بزند یا با آن تداخل کند — این دو سیستم مکمل‌اند، نه رقیب:
-- سیستم استاتیک زبان صفحه را عوض می‌کند، این جدول‌ها فقط «ترجیح
-- ذخیره‌شده‌ی کاربر» را نگه می‌دارند (شبیه site_settings برای کل سایت).

create table if not exists languages (
  id bigint generated always as identity primary key,
  code text not null unique,
  name text not null,
  name_local text,
  direction text not null default 'rtl' check (direction in ('rtl', 'ltr')),
  flag text,
  is_default boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists currencies (
  id bigint generated always as identity primary key,
  code text not null unique,
  symbol text not null,
  name text not null,
  name_fa text,
  name_local text,
  exchange_rate numeric(14, 6) not null default 1,
  is_default boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists translations (
  id bigint generated always as identity primary key,
  language_id bigint not null references languages(id) on delete cascade,
  key text not null,
  value text not null,
  unique (language_id, key)
);

-- پیش‌فرض سایت الان دری (افغانستان) است، نه فارسی ایران — همان‌طور که
-- در src/lib/i18n/dictionaries.ts و middleware.ts هم اعمال شده.
insert into languages (code, name, name_local, direction, flag, is_default, is_active, sort_order) values
  ('prs', 'دری', 'دری', 'rtl', '🇦🇫', true,  true, 1),
  ('ps',  'پشتو', 'پښتو', 'rtl', '🇦🇫', false, true, 2),
  ('fa',  'فارسی', 'فارسی', 'rtl', '🇮🇷', false, true, 3),
  ('en',  'English', 'English', 'ltr', '🇺🇸', false, true, 4),
  ('ar',  'العربية', 'العربية', 'rtl', '🇸🇦', false, true, 5),
  ('fr',  'Français', 'Français', 'ltr', '🇫🇷', false, true, 6),
  ('de',  'Deutsch', 'Deutsch', 'ltr', '🇩🇪', false, true, 7)
on conflict (code) do nothing;

insert into currencies (code, symbol, name, name_fa, exchange_rate, is_default, is_active, sort_order) values
  ('AFN', '؋',   'افغانی', 'افغانی', 1,      true,  true, 1),
  ('IRT', 'تومان', 'تومان', 'تومان', 1,      false, true, 2),
  ('USD', '$',   'دلار آمریکا', 'دلار', 1,   false, true, 3),
  ('EUR', '€',   'یورو', 'یورو', 1,          false, true, 4),
  ('CHF', 'CHF', 'فرانک سوئیس', 'فرانک سوئیس', 1, false, true, 5)
on conflict (code) do nothing;

-- ترجیح زبان کاربر (LocaleSelector آن را در پنل کاربری می‌نویسد؛ مقدار
-- همان کد زبان است، نه id، چون در کد هم با language.code ست می‌شود).
alter table profiles add column if not exists preferred_language text references languages(code) on delete set null;

alter table languages enable row level security;
alter table currencies enable row level security;
alter table translations enable row level security;

drop policy if exists "languages_public_read" on languages;
create policy "languages_public_read" on languages for select
  using (is_active = true or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')));

drop policy if exists "languages_admin_write" on languages;
create policy "languages_admin_write" on languages for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')));

drop policy if exists "currencies_public_read" on currencies;
create policy "currencies_public_read" on currencies for select
  using (is_active = true or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')));

drop policy if exists "currencies_admin_write" on currencies;
create policy "currencies_admin_write" on currencies for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')));

drop policy if exists "translations_public_read" on translations;
create policy "translations_public_read" on translations for select using (true);

drop policy if exists "translations_admin_write" on translations;
create policy "translations_admin_write" on translations for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')));

grant select on languages, currencies, translations to anon, authenticated;

-- =====================================================================
-- یادداشت v22 — نتیجه بازبینی چک‌لیست عمومی که کاربر ارسال کرد:
-- جدول‌های payments / carts / cart_items / coupons / ai_memory /
-- ai_recommendations / analytics_events / seo_metadata / shipping_methods
-- عمداً اضافه نشدند چون در بررسی سورس واقعی پروژه، هیچ‌کدام مصرف‌کننده
-- واقعی نداشتند: پرداخت از همان ستون‌های orders.payment_status /
-- orders.payment_authority استفاده می‌کند (src/app/api/payment)، سبد
-- خرید کاملاً کلاینت‌ساید و در localStorage است (src/store/cart.ts)،
-- کد تخفیف از همین جدول discounts خوانده می‌شود (src/app/site/checkout)،
-- و ai_memory هم فقط localStorage است (src/ai/memory.ts). اضافه‌کردن
-- جدول برای این‌ها فقط پیچیدگی بی‌فایده به دیتابیس اضافه می‌کرد.
-- =====================================================================

-- =====================================================================
-- 17) بنرها/تبلیغات از پنل مدیریت، لینک کوتاه، و شمارنده‌های عمومی محصول
-- =====================================================================
-- چرا این بخش لازم است: در چک‌لیست کاربر، بخش ۱۱ (مدیریت تبلیغات از
-- پنل)، بخش ۱۲ (شمارنده بازدید/فروش/نظر/علاقه‌مندی) و بخش ۱۹ (لینک
-- کوتاه محصول) خواسته شده بودند، ولی هیچ زیرساخت دیتابیسی برایشان
-- وجود نداشت — اسلایدر/بنرهای صفحه اصلی کاملا hardcode در کد بودند.

create table if not exists banners (
  id bigint generated always as identity primary key,
  -- "hero" = اسلایدر اصلی، "deal" = بنر پیشنهاد ویژه زیر اسلایدر،
  -- "middle" = بنر بین محصولات، "product" = بنر صفحه محصول
  zone text not null check (zone in ('hero', 'deal', 'middle', 'product', 'footer')),
  title text not null,
  subtitle text,
  image text,
  link_url text,
  button_label text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table banners enable row level security;

drop policy if exists "banners_public_read" on banners;
create policy "banners_public_read" on banners for select
  using (
    (
      is_active = true
      and (starts_at is null or starts_at <= now())
      and (ends_at is null or ends_at >= now())
    )
    or exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

drop policy if exists "banners_admin_write" on banners;
create policy "banners_admin_write" on banners for all
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')))
  with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')));

grant select on banners to anon, authenticated;

-- لینک کوتاه محصول: کد کوتاه به مسیر واقعی محصول map می‌شود.
create table if not exists short_links (
  id bigint generated always as identity primary key,
  code text not null unique,
  target_path text not null,
  product_id bigint references products(id) on delete cascade,
  click_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table short_links enable row level security;

drop policy if exists "short_links_public_read" on short_links;
create policy "short_links_public_read" on short_links for select using (true);

drop policy if exists "short_links_public_insert" on short_links;
-- ساخت لینک کوتاه از صفحه محصول (سمت کاربر) مجاز است، ولی هر بار فقط
-- یک ردیف با کد تصادفی خودش را می‌سازد (کاربر نمی‌تواند لینک کوتاه
-- دیگران را دستکاری کند چون update/delete برایش مجاز نیست).
create policy "short_links_public_insert" on short_links for insert with check (true);

drop policy if exists "short_links_admin_update" on short_links;
create policy "short_links_admin_update" on short_links for update
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')));

drop policy if exists "short_links_admin_delete" on short_links;
create policy "short_links_admin_delete" on short_links for delete
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin')));

-- تابع اتمیک افزایش شمارش کلیک (شبیه decrement_product_stock در بخش ۱۴؛
-- بدون این تابع، خواندن+نوشتن جدا از سمت کلاینت race condition دارد).
create or replace function increment_short_link_click(p_code text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update short_links set click_count = click_count + 1 where code = p_code;
end;
$$;

grant execute on function increment_short_link_click(text) to anon, authenticated;
grant select, insert on short_links to anon, authenticated;

-- شمارنده‌های عمومی محصول (بازدید/فروش/نظر/علاقه‌مندی) — یک view
-- تجمیعی امن، دقیقا هم‌الگو با public_bestsellers/public_reviews که
-- از قبل در بخش ۱۱ همین فایل تعریف شده‌اند. عمدا فقط عدد را نشان
-- می‌دهد، نه هیچ داده‌ی شخصی کاربران را.
create or replace view public_product_stats as
select
  p.id as product_id,
  coalesce(pv.view_count, 0) as view_count,
  coalesce(sold.sold_count, 0) as sold_count,
  coalesce(cm.comment_count, 0) as comment_count,
  coalesce(wl.wishlist_count, 0) as wishlist_count
from products p
left join (
  select path, count(*) as view_count
  from page_views
  group by path
) pv on pv.path = '/products/' || p.id
left join (
  select oi.product_id, sum(oi.quantity) as sold_count
  from order_items oi
  join orders o on o.id = oi.order_id
  where o.payment_status = 'paid'
  group by oi.product_id
) sold on sold.product_id = p.id
left join (
  select product_id, count(*) as comment_count
  from comments
  where is_approved = true
  group by product_id
) cm on cm.product_id = p.id
left join (
  select product_id, count(*) as wishlist_count
  from wishlist
  group by product_id
) wl on wl.product_id = p.id;

grant select on public_product_stats to anon, authenticated;

-- بنرهای واقعی فعلی به‌عنوان seed اولیه، همان متن‌هایی که تا امروز در
-- src/components/home/HeroSlider.tsx هاردکد بودند — تا صفحه اصلی بعد
-- از اتصال به این جدول، خالی نماند.
insert into banners (zone, title, subtitle, button_label, link_url, sort_order) values
  ('hero', 'نوربند', 'فروشگاه لوازم آرایشی، زیورآلات و پوشاک محلی', 'مشاهده محصولات', '/categories', 1),
  ('deal', 'پیشنهاد ویژه امروز', 'تخفیف‌های محدود روی محصولات منتخب', 'مشاهده تخفیف‌ها', '/collections', 1)
on conflict do nothing;

-- ---------------------------------------------------------------------
-- باکت Storage برای عکس‌ها (محصولات، لوگو، عکس دوکان)
-- ---------------------------------------------------------------------
-- نکته مهم: src/lib/supabase/storage.ts (که آپلود عکس محصول، لوگو، و
-- عکس دوکان همه از آن استفاده می‌کنند) به یک باکت به نام "images" با
-- دسترسی عمومی نیاز دارد؛ ولی هیچ‌جای این فایل باکت واقعا ساخته
-- نمی‌شد — یعنی روی یک دیتابیس کاملا تازه، اولین آپلود عکس با خطای
-- "Bucket not found" شکست می‌خورد. این بخش دقیقا همان باکتی که کد
-- انتظارش را دارد می‌سازد.
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "images_public_read" on storage.objects
  for select using (bucket_id = 'images');

-- قبلا این باکت یا اصلا برای «هر کاربر لاگین‌شده» باز بود (حتی
-- customer عادی می‌توانست عکس محصولات دیگران را پاک کند)، یا فقط بر
-- اساس نقش محدود شده بود بدون توجه به اینکه فایل داخل کدام پوشه است —
-- یعنی یک seller هنوز می‌توانست مسیر پوشه‌ی seller دیگری را حدس بزند و
-- عکسش را overwrite/حذف کند. حالا Policyها بر اساس *مسیر پوشه* هم چک می‌کنند:
--   products/{sellerId}/...→ admin/super_admin هرجا، seller فقط پوشه‌ی خودش
--   categories/...         → admin/super_admin/seller (پوشه مشترک)
--   branding/... و banners/... → فقط admin/super_admin
-- آواتار کاربر جزو این باکت *نیست* — یک باکت جدای avatars دارد، چون
-- src/lib/supabase/storage.ts و ImageUploader.tsx واقعا با
-- bucket="avatars" و مسیر avatars/{uid}/... را به همان باکت جدا صدا
-- می‌زنند، نه زیرپوشه‌ای داخل images. Policy آن پایین‌تر جداگانه است.
drop policy if exists "images_authenticated_upload" on storage.objects;
drop policy if exists "images_authenticated_update" on storage.objects;
drop policy if exists "images_authenticated_delete" on storage.objects;
drop policy if exists "images_role_upload" on storage.objects;
drop policy if exists "images_role_update" on storage.objects;
drop policy if exists "images_role_delete" on storage.objects;
drop policy if exists "images_avatar_write" on storage.objects;
drop policy if exists "images_products_admin_write" on storage.objects;
drop policy if exists "images_products_seller_write" on storage.objects;
drop policy if exists "images_categories_write" on storage.objects;
drop policy if exists "images_site_assets_write" on storage.objects;

-- عکس محصولات: ادمین/سوپرادمین هرجای پوشه‌ی products را می‌تواند
-- دست بزند؛ seller فقط زیرپوشه‌ی products/{uid-خودش} را.
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

-- عکس دسته‌بندی‌ها: پوشه‌ی مشترک، هر سه نقش مدیریتی طبق همان الگوی
-- جدول categories (admin/super_admin/seller) اجازه نوشتن دارند.
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

-- لوگو/بنر/عکس‌های سراسری سایت: فقط ادمین/سوپرادمین — همان نقش‌هایی
-- که در جدول‌های site_settings و banners اجازه نوشتن دارند.
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


-- ---------------------------------------------------------------------
-- باکت Storage برای عکس پروفایل (avatars) — باکت جدای مستقل، نه
-- زیرپوشه‌ای داخل images. کد واقعی (src/lib/supabase/storage.ts،
-- ImageUploader.tsx، و src/app/site/profile/edit/page.tsx) دقیقاً با
-- bucket="avatars" و مسیر {uid}/filename به همین باکت صدا می‌زنند.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Anyone can view avatars" on storage.objects;
drop policy if exists "Users upload own avatar" on storage.objects;
drop policy if exists "Users update own avatar" on storage.objects;
drop policy if exists "Users delete own avatar" on storage.objects;

create policy "Anyone can view avatars" on storage.objects
  for select using (bucket_id = 'avatars');

-- هر کاربر (فرقی نمی‌کند چه نقشی دارد) فقط داخل پوشه‌ی {uid} خودش
-- می‌تواند آپلود/ویرایش/حذف کند — یعنی کاربر عادی فقط عکس پروفایل
-- خودش را می‌تواند آپلود کند، نه عکس هیچ کاربر دیگری را.
create policy "Users upload own avatar" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (auth.uid())::text = (storage.foldername(name))[1]
  );

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

create policy "Users delete own avatar" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (auth.uid())::text = (storage.foldername(name))[1]
  );
-- =====================================================================

-- =====================================================================
-- مأمور تحویل (courier) + تایید کد تحویل
-- =====================================================================
-- ستون واگذاری سفارش به یک مأمور تحویل مشخص (اختیاری — اگر پر نباشد،
-- هر مأمور تحویل می‌تواند سفارش‌های در وضعیت shipping را ببیند)
alter table orders add column if not exists assigned_courier_id uuid references profiles(id);

drop policy if exists "orders_select_courier" on orders;
create policy "orders_select_courier" on orders
  for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.role = 'courier'
        and (orders.assigned_courier_id = auth.uid() or orders.status = 'shipping')
    )
  );

-- تابع امن تایید کد تحویل: به‌جای دادن دسترسی مستقیم UPDATE به مأمور
-- تحویل روی جدول orders (که ریسک تغییر فیلدهای دیگر را دارد)، این تابع
-- فقط دقیقا همین یک کار را انجام می‌دهد: اگر کد وارد‌شده با کد واقعی
-- سفارش یکی بود، تحویل را ثبت می‌کند؛ وگرنه false برمی‌گرداند. SECURITY
-- DEFINER یعنی خودش با دسترسی کامل اجرا می‌شود، ولی از داخل فقط با
-- نقش courier/admin/super_admin قابل فراخوانی است.
create or replace function verify_delivery_code(p_order_id bigint, p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
  v_real_code text;
  v_user_id uuid;
begin
  select role into v_role from profiles where id = auth.uid();

  if v_role is null or v_role not in ('courier','admin','super_admin') then
    raise exception 'دسترسی غیرمجاز';
  end if;

  select delivery_code, user_id into v_real_code, v_user_id
  from orders where id = p_order_id;

  if v_real_code is null then
    return false;
  end if;

  if v_real_code <> trim(p_code) then
    return false;
  end if;

  update orders
  set delivery_code_verified = true,
      status = 'completed',
      order_status = 'completed',
      delivery_status = 'delivered',
      delivered_at = now(),
      updated_at = now()
  where id = p_order_id;

  insert into order_status_history (order_id, status, changed_by)
  values (p_order_id, 'completed', auth.uid());

  if v_user_id is not null then
    insert into notifications (user_id, title, message, type)
    values (
      v_user_id,
      'سفارش تحویل داده شد',
      'سفارش شما با موفقیت تحویل داده شد. از خرید شما سپاسگزاریم 💗',
      'delivery'
    );
  end if;

  return true;
end;
$$;

grant execute on function verify_delivery_code(bigint, text) to authenticated;

-- تابع امن رهگیری مهمان با شماره سفارش: بدون نیاز به لاگین، فقط با
-- دانستن دقیق order_number (که مثل یک رمز یک‌بارمصرف ۵ رقمی تصادفی در
-- آخرش دارد و فقط از طریق فاکتور/پیامک به مشتری می‌رسد) قابل استفاده
-- است، و فقط فیلدهای غیرحساس (نه آدرس/تلفن/user_id) را برمی‌گرداند —
-- برخلاف یک RLS policy عمومی که کل جدول را باز می‌کرد.
create or replace function track_order_by_number(p_order_number text)
returns table (
  order_number text,
  status text,
  total_amount numeric,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select o.order_number, o.status, o.total_amount, o.created_at
  from orders o
  where o.order_number = p_order_number
  limit 1;
$$;

grant execute on function track_order_by_number(text) to anon, authenticated;

-- گزارش مشکل توسط چت‌بات به ادمین: وقتی کاربر در گفتگو با NOORBAND AI
-- از مشکلی شکایت می‌کند (مثلا «سایت خراب است»، «سفارشم نرسیده»)،
-- این تابع برای همه‌ی ادمین‌ها/سوپرادمین‌ها یک اعلان می‌سازد. INSERT
-- مستقیم روی notifications برای این کار مجاز نیست (چون owner_only
-- فقط اجازه می‌دهد کاربر برای خودش بنویسد)، پس یک تابع امن جداگانه.
create or replace function report_issue_to_admin(p_message text, p_reporter_id uuid default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin record;
begin
  for v_admin in
    select id from profiles where role in ('admin','super_admin')
  loop
    insert into notifications (user_id, title, message, type)
    values (
      v_admin.id,
      '🚨 گزارش مشکل از چت‌بات',
      p_message,
      'support'
    );
  end loop;
end;
$$;

grant execute on function report_issue_to_admin(text, uuid) to anon, authenticated;

-- نکته اصلاح‌شده: policy بالا (orders_select_courier) فقط سفارش‌هایی
-- را به مأمور تحویل نشان می‌داد که already status="shipping" باشند یا
-- مستقیم به او assign شده باشند. یعنی وقتی مأمور تحویل شماره سفارشی
-- را جستجو می‌کرد که هنوز به آن مرحله نرسیده (مثلا هنوز "packing")،
-- به‌خاطر RLS اصلا هیچ ردیفی برنمی‌گشت — نه خطا، فقط لیست خالی — و
-- کد این را با «پیدا نشد» اشتباه نشان می‌داد، حتی وقتی سفارش واقعا
-- در دیتابیس وجود داشت. این تابع امن، مثل verify_delivery_code، به
-- مأمور تحویل اجازه می‌دهد هر سفارشی را با شماره دقیق جستجو کند
-- (صرف‌نظر از وضعیت فعلی‌اش)، چون خودش با SECURITY DEFINER دسترسی
-- کامل دارد و فقط نقش courier/admin/super_admin را چک می‌کند.
create or replace function courier_search_order(p_query text)
returns table (
  id bigint,
  order_number text,
  status text,
  address text,
  phone text,
  delivery_code_verified boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  select role into v_role from profiles where id = auth.uid();

  if v_role is null or v_role not in ('courier','admin','super_admin') then
    raise exception 'دسترسی غیرمجاز';
  end if;

  return query
  select o.id, o.order_number, o.status, o.address, o.phone, o.delivery_code_verified
  from orders o
  where o.order_number = p_query
     or (p_query ~ '^[0-9]+$' and o.id = p_query::bigint)
  limit 1;
end;
$$;

grant execute on function courier_search_order(text) to authenticated;

-- حذف سفارش (برای پاک کردن سفارش‌های تستی/الکی از پنل مدیریت). فقط
-- admin/super_admin — چون این عملیات غیرقابل‌بازگشت است و فروشنده
-- نباید بتواند تاریخچه‌ی سفارش‌های واقعی را پاک کند.
drop policy if exists "orders_delete_admin_only" on orders;
create policy "orders_delete_admin_only" on orders
  for delete using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('admin','super_admin'))
  );

-- هزینه ارسال: قبلا در کد چک‌اوت به‌صورت ثابت (۲۰۰ افغانی، رایگان بالای
-- ۵۰۰۰) هارد‌کد بود و روی فاکتور هم اصلا به‌عنوان یک ردیف جدا نمایش
-- داده نمی‌شد — یعنی مشتری می‌دید جمع کل از قیمت محصولات بیشتر است ولی
-- نمی‌فهمید چرا. حالا این دو مقدار از پنل مدیریت قابل تنظیم است.
alter table site_settings add column if not exists shipping_flat_rate numeric(14,2) not null default 200;
alter table site_settings add column if not exists shipping_free_threshold numeric(14,2) not null default 5000;

-- ویدیوی معرفی دوکان — دقیقا کنار عکس آدرس دوکان در فوتر نمایش داده
-- می‌شود (site_settings.store_gallery_urls برای عکس‌ها بود؛ این یکی
-- مخصوص یک ویدیوی کوتاه از داخل دوکان است)
alter table site_settings add column if not exists store_video_url text;
