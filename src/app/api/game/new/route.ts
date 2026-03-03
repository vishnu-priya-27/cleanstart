import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Mark any existing active games as lost before creating new one
  await supabase
    .from("games")
    .update({ status: "lost" })
    .eq("user_id", user.id)
    .eq("status", "active");

  const { data: game, error } = await supabase
    .from("games")
    .insert({
      user_id: user.id,
      quarter: 1,
      cash: 1000000,
      engineers: 4,
      sales_staff: 2,
      quality: 50,
      status: "active",
      cumulative_revenue: 0,
      cumulative_costs: 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ game, turns: [] });
}
