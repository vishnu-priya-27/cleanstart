import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: game, error: gameError } = await supabase
    .from("games")
    .select()
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (gameError) {
    return NextResponse.json({ error: gameError.message }, { status: 500 });
  }

  if (!game) {
    return NextResponse.json({ game: null, turns: [] });
  }

  const { data: turns, error: turnsError } = await supabase
    .from("game_turns")
    .select()
    .eq("game_id", game.id)
    .order("quarter", { ascending: true });

  if (turnsError) {
    return NextResponse.json({ error: turnsError.message }, { status: 500 });
  }

  return NextResponse.json({ game, turns: turns ?? [] });
}
