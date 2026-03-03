import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // If email confirmations are disabled, Supabase returns a session and user is effectively logged in.
  // If confirmations are enabled, user must confirm email before they can sign in.
  return NextResponse.json({
    ok: true,
    needs_email_confirmation: !data.session,
  });
}

