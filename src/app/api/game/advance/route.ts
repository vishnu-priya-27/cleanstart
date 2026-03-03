import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { runSimulation, getMaxQuarter } from "@/lib/simulation";
import type { Decisions } from "@/lib/types";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    game_id: string;
    decisions: Decisions;
  };

  const { game_id, decisions } = body;

  if (
    !game_id ||
    !decisions ||
    typeof decisions.unit_price !== "number" ||
    typeof decisions.new_engineers !== "number" ||
    typeof decisions.new_sales !== "number" ||
    typeof decisions.salary_pct !== "number"
  ) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  if (decisions.unit_price < 50 || decisions.unit_price > 5000) {
    return NextResponse.json(
      { error: "Unit price must be between $50 and $5,000" },
      { status: 400 }
    );
  }
  if (decisions.new_engineers < 0 || decisions.new_engineers > 20) {
    return NextResponse.json(
      { error: "New engineers must be between 0 and 20" },
      { status: 400 }
    );
  }
  if (decisions.new_sales < 0 || decisions.new_sales > 20) {
    return NextResponse.json(
      { error: "New sales hires must be between 0 and 20" },
      { status: 400 }
    );
  }
  if (decisions.salary_pct < 50 || decisions.salary_pct > 150) {
    return NextResponse.json(
      { error: "Salary % must be between 50 and 150" },
      { status: 400 }
    );
  }

  // Fetch the current game
  const { data: game, error: gameError } = await supabase
    .from("games")
    .select()
    .eq("id", game_id)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (gameError || !game) {
    return NextResponse.json(
      { error: "Game not found or already ended" },
      { status: 404 }
    );
  }

  // Run the simulation server-side
  const result = runSimulation({
    quarter: game.quarter,
    cash: game.cash,
    engineers: game.engineers,
    sales_staff: game.sales_staff,
    quality: Number(game.quality ?? 50),
    decisions,
  });

  // Determine game status
  const nextQuarter = game.quarter + 1;
  let newStatus: "active" | "won" | "lost" = "active";

  if (result.cash_after <= 0) {
    newStatus = "lost";
  } else if (nextQuarter > getMaxQuarter()) {
    newStatus = "won";
  }

  const newCumulativeRevenue =
    Number(game.cumulative_revenue) + result.revenue;
  const newCumulativeCosts =
    Number(game.cumulative_costs) + result.total_costs;

  // Insert the turn record
  const { error: turnError } = await supabase.from("game_turns").insert({
    game_id: game.id,
    quarter: game.quarter,
    unit_price: decisions.unit_price,
    new_engineers: decisions.new_engineers,
    new_sales: decisions.new_sales,
    salary_pct: decisions.salary_pct,
    revenue: result.revenue,
    units_sold: result.units_sold,
    net_income: result.net_income,
    cash_after: result.cash_after,
    engineers_after: result.engineers_after,
    sales_after: result.sales_after,
    total_costs: result.total_costs,
  });

  if (turnError) {
    return NextResponse.json({ error: turnError.message }, { status: 500 });
  }

  // Update the game state
  const updateData: Record<string, unknown> = {
    quarter: newStatus === "active" ? nextQuarter : game.quarter,
    cash: result.cash_after,
    engineers: result.engineers_after,
    sales_staff: result.sales_after,
    quality: result.quality_after,
    status: newStatus,
    cumulative_revenue: newCumulativeRevenue,
    cumulative_costs: newCumulativeCosts,
    updated_at: new Date().toISOString(),
  };

  const { data: updatedGame, error: updateError } = await supabase
    .from("games")
    .update(updateData)
    .eq("id", game.id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Fetch all turns for the updated game
  const { data: turns } = await supabase
    .from("game_turns")
    .select()
    .eq("game_id", game.id)
    .order("quarter", { ascending: true });

  return NextResponse.json({ game: updatedGame, turns: turns ?? [] });
}
