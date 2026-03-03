export interface Game {
  id: string;
  user_id: string;
  quarter: number;
  cash: number;
  engineers: number;
  sales_staff: number;
  quality: number;
  status: "active" | "won" | "lost";
  cumulative_revenue: number;
  cumulative_costs: number;
  created_at: string;
  updated_at: string;
}

export interface GameTurn {
  id: string;
  game_id: string;
  quarter: number;
  unit_price: number;
  new_engineers: number;
  new_sales: number;
  salary_pct: number;
  revenue: number;
  units_sold: number;
  net_income: number;
  cash_after: number;
  engineers_after: number;
  sales_after: number;
  total_costs: number;
  created_at: string;
}

export interface Decisions {
  unit_price: number;
  new_engineers: number;
  new_sales: number;
  salary_pct: number;
}

export interface SimulationInput {
  quarter: number;
  cash: number;
  engineers: number;
  sales_staff: number;
  quality: number;
  decisions: Decisions;
}

export interface SimulationResult {
  revenue: number;
  units_sold: number;
  total_costs: number;
  net_income: number;
  cash_after: number;
  engineers_after: number;
  sales_after: number;
  quality_after: number;
}

export interface GameState {
  game: Game;
  turns: GameTurn[];
}
