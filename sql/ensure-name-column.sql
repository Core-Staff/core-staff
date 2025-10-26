-- Ensure extension for gen_random_uuid
create extension if not exists pgcrypto;

-- Add name column if missing
alter table public.employees add column if not exists name text;

-- Backfill from first_name/last_name if they exist
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='employees' and column_name='first_name')
     and exists (select 1 from information_schema.columns where table_schema='public' and table_name='employees' and column_name='last_name') then
    update public.employees set name = coalesce(name, trim(both from concat_ws(' ', first_name, last_name))) where name is null or name = '';
  end if;
end $$;

-- Optional strictness: make name required
-- alter table public.employees alter column name set not null;

-- Helpful index
create index if not exists employees_name_idx on public.employees (name);

