import { NextResponse } from "next/server";
import { supabase } from "@/lib/data/supabase";

const SQL_ADD_NAME = `
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

-- Set NOT NULL if you want strict enforcement (optional):
-- alter table public.employees alter column name set not null;

-- Helpful index
create index if not exists employees_name_idx on public.employees (name);
`;

export async function GET() {
  try {
    const res = await supabase.from("employees").select("name").limit(1);
    if (res.error) {
      return NextResponse.json(
        {
          ok: false,
          missing: true,
          suggestion: SQL_ADD_NAME,
          error: res.error.message,
        },
        { status: 200 },
      );
    }
    return NextResponse.json({ ok: true, missing: false });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 },
    );
  }
}
