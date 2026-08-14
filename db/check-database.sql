-- =====================================================================
-- اسکریپت بررسی دیتابیس — samsari-noorband
-- =====================================================================
-- این اسکریپت فقط می‌خواند (SELECT) — هیچ جدول، Policy، یا داده‌ای را
-- تغییر نمی‌دهد. کافی است کل این فایل را در Supabase → SQL Editor
-- کپی و اجرا کنی؛ یک جدول واحد با ستون‌های check_name / status
-- برمی‌گرداند. هر ردیف که با ❌ یا ⚠️ شروع شود یعنی آن بخش از
-- db/migration-2-real-fixes.sql هنوز روی دیتابیس زنده‌ات اجرا نشده.
--
-- نکته: این نسخه بر اساس اسم‌های *واقعی* Policyها نوشته شده (که با
-- کوئری از pg_policies بیرون کشیدیم — مثلا pawn_details_admin_write،
-- نه product_pawn_details_admin_write)، نه فرضیات schema.sql.
-- =====================================================================

with

-- ---------------------------------------------------------------------
-- ۱) ستون‌ها
-- ---------------------------------------------------------------------
column_checks as (
  select
    'ستون products.seller_id' as check_name,
    case when exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'products' and column_name = 'seller_id'
    ) then '✅ موجود' else '❌ وجود ندارد — migration-2-real-fixes.sql را اجرا کن' end as status
),

-- ---------------------------------------------------------------------
-- ۲) فعال‌بودن RLS روی جدول‌های کلیدی
-- ---------------------------------------------------------------------
rls_expected(tbl) as (
  values ('products'), ('product_images'), ('product_pawn_details'),
         ('brands'), ('categories'), ('profiles')
),
rls_checks as (
  select
    'RLS فعال روی ' || e.tbl as check_name,
    case when coalesce(c.relrowsecurity, false)
      then '✅ فعال'
      else '❌ غیرفعال — این جدول بدون محدودیت برای همه باز است'
    end as status
  from rls_expected e
  left join pg_class c on c.relname = e.tbl and c.relnamespace = 'public'::regnamespace
),

-- ---------------------------------------------------------------------
-- ۳) Policyهای جدید/اصلاح‌شده‌ای که باید موجود باشند (اسم واقعی)
-- ---------------------------------------------------------------------
expected_policies(schemaname, tablename, policyname) as (
  values
    ('public','products','products_public_read'),
    ('public','products','products_admin_all'),
    ('public','products','products_seller_insert'),
    ('public','products','products_seller_update'),
    ('public','products','products_seller_delete'),

    ('public','product_images','product_images_public_read'),
    ('public','product_images','product_images_admin_all'),
    ('public','product_images','product_images_seller_write'),

    ('public','product_pawn_details','pawn_details_admin_read'),
    ('public','product_pawn_details','pawn_details_seller_read'),
    ('public','product_pawn_details','pawn_details_admin_write'),
    ('public','product_pawn_details','pawn_details_seller_write'),

    ('public','brands','brands_public_read'),
    ('public','brands','brands_admin_all'),
    ('public','brands','brands_seller_insert'),

    ('public','categories','categories_public_read'),
    ('public','categories','categories_admin_all'),
    ('public','categories','categories_seller_insert'),

    ('public','profiles','profiles_select_own_or_admin'),
    ('public','profiles','profiles_update_own'),
    ('public','profiles','profiles_admin_write'),

    ('storage','objects','images_public_read'),
    ('storage','objects','images_products_admin_write'),
    ('storage','objects','images_products_seller_write'),
    ('storage','objects','images_categories_write'),
    ('storage','objects','images_site_assets_write'),

    ('storage','objects','Anyone can view avatars'),
    ('storage','objects','Users upload own avatar'),
    ('storage','objects','Users update own avatar'),
    ('storage','objects','Users delete own avatar')
),
policy_checks as (
  select
    'Policy: ' || e.tablename || '.' || e.policyname as check_name,
    case when p.policyname is not null
      then '✅ موجود'
      else '❌ وجود ندارد'
    end as status
  from expected_policies e
  left join pg_policies p
    on p.schemaname = e.schemaname
   and p.tablename = e.tablename
   and p.policyname = e.policyname
),

-- ---------------------------------------------------------------------
-- ۴) Policyهای قدیمیِ ناامن که باید حذف شده باشند (اگر هنوز هستند یعنی
--    نسخه‌ی قدیمی کنار نسخه‌ی جدید مانده و محدودیت واقعا اعمال نشده)
-- ---------------------------------------------------------------------
old_policies(schemaname, tablename, policyname) as (
  values
    ('public','products','products_admin_write'),
    ('public','product_images','product_images_admin_write'),
    ('public','product_pawn_details','pawn_details_public_read'),
    ('public','brands','brands_admin_write'),
    ('public','categories','categories_admin_write'),
    ('storage','objects','images_authenticated_upload'),
    ('storage','objects','images_authenticated_update'),
    ('storage','objects','images_authenticated_delete')
),
old_policy_checks as (
  select
    'Policy قدیمی: ' || o.tablename || '.' || o.policyname as check_name,
    case when p.policyname is not null
      then '❌ هنوز موجود است — باید حذف شود (drop policy)'
      else '✅ درست حذف شده'
    end as status
  from old_policies o
  left join pg_policies p
    on p.schemaname = o.schemaname
   and p.tablename = o.tablename
   and p.policyname = o.policyname
),

-- ---------------------------------------------------------------------
-- ۵) Triggerهای کلیدی
-- ---------------------------------------------------------------------
trigger_expected(trg, tbl) as (
  values
    ('trg_prevent_self_role_escalation', 'profiles'),
    ('on_auth_user_created', 'users')
),
trigger_checks as (
  select
    'Trigger: ' || e.trg as check_name,
    case when exists (
      select 1 from pg_trigger t
      join pg_class c on c.oid = t.tgrelid
      where t.tgname = e.trg and c.relname = e.tbl and not t.tgisinternal
    ) then '✅ موجود' else '❌ وجود ندارد' end as status
  from trigger_expected e
),

-- ---------------------------------------------------------------------
-- ۶) باکت‌های Storage «images» و «avatars»
-- ---------------------------------------------------------------------
bucket_checks as (
  select 'باکت Storage images' as check_name,
    case
      when not exists (select 1 from storage.buckets where id = 'images')
        then '❌ باکت images اصلا ساخته نشده'
      when not (select public from storage.buckets where id = 'images')
        then '⚠️ باکت images هست ولی public نیست'
      else '✅ باکت images موجود و public است'
    end as status
  union all
  select 'باکت Storage avatars' as check_name,
    case
      when not exists (select 1 from storage.buckets where id = 'avatars')
        then '❌ باکت avatars اصلا ساخته نشده'
      when not (select public from storage.buckets where id = 'avatars')
        then '⚠️ باکت avatars هست ولی public نیست'
      else '✅ باکت avatars موجود و public است'
    end
)

select * from column_checks
union all
select * from rls_checks
union all
select * from policy_checks
union all
select * from old_policy_checks
union all
select * from trigger_checks
union all
select * from bucket_checks
order by
  (status like '✅%') asc,  -- مشکل‌دارها (❌/⚠️) اول نمایش داده شوند
  check_name;
