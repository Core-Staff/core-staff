import { NextResponse } from "next/server";
import { supabase } from "@/lib/data/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body?.email || "").trim();
    if (!email) {
      return NextResponse.json({ error: "missing_email" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("employees")
      .select("id,name,department,email")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}