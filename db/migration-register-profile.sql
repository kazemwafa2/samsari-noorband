-- ============================================================
-- سیمساری نوربند جاغوری
-- Migration: اطلاعات کامل ثبت‌نام کاربران
-- این فایل اطلاعات قبلی را حذف یا تغییر نمی‌دهد.
-- ============================================================

alter table public.profiles
  add column if not exists surname text;

alter table public.profiles
  add column if not exists birth_date date;

alter table public.profiles
  add column if not exists phone_code text;

alter table public.profiles
  add column if not exists country_id uuid;

alter table public.profiles
  add column if not exists city_id uuid;

alter table public.profiles
  add column if not exists village text;

-- اتصال مکان به جداول موجود
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_country_id_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_country_id_fkey
      foreign key (country_id)
      references public.countries(id)
      on delete set null;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_province_id_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_province_id_fkey
      foreign key (province_id)
      references public.provinces(id)
      on delete set null;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_district_id_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_district_id_fkey
      foreign key (district_id)
      references public.districts(id)
      on delete set null;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_city_id_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_city_id_fkey
      foreign key (city_id)
      references public.cities(id)
      on delete set null;
  end if;
end $$;

-- ایندکس برای جستجوی سریع‌تر
create index if not exists idx_profiles_country_id
  on public.profiles(country_id);

create index if not exists idx_profiles_province_id
  on public.profiles(province_id);

create index if not exists idx_profiles_district_id
  on public.profiles(district_id);

create index if not exists idx_profiles_city_id
  on public.profiles(city_id);
