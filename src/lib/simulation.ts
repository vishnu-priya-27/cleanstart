import { SimulationInput, SimulationResult } from "./types";

const MAX_QUARTER = 40; // 10 years
const INDUSTRY_AVG_SALARY_PER_QUARTER = 30000;
const QUALITY_ENGINEER_DELTA = 0.5;
const QUALITY_MAX = 100;
const DEMAND_QUALITY_MULTIPLIER = 10;
const DEMAND_PRICE_MULTIPLIER = 0.0001;
const UNITS_SOLD_SALES_MULTIPLIER = 0.5;
const HIRING_COST_PER_PERSON = 5000;

export function getMaxQuarter() {
  return MAX_QUARTER;
}

export function runSimulation(input: SimulationInput): SimulationResult {
  const { cash, engineers, sales_staff, quality, decisions } = input;
  const { unit_price, new_engineers, new_sales, salary_pct } = decisions;

  const engineersAfterHire = engineers + new_engineers;
  const salesAfterHire = sales_staff + new_sales;

  const payrollPerPerson =
    (salary_pct / 100) * INDUSTRY_AVG_SALARY_PER_QUARTER;
  const totalPayroll = payrollPerPerson * (engineersAfterHire + salesAfterHire);

  const qualityAfter = Math.min(
    QUALITY_MAX,
    quality + engineersAfterHire * QUALITY_ENGINEER_DELTA
  );

  const demand = Math.max(
    0,
    qualityAfter * DEMAND_QUALITY_MULTIPLIER - unit_price * DEMAND_PRICE_MULTIPLIER
  );

  const unitsSold = Math.floor(
    demand * salesAfterHire * UNITS_SOLD_SALES_MULTIPLIER
  );
  const revenue = unit_price * unitsSold;

  const hiringCosts = (new_engineers + new_sales) * HIRING_COST_PER_PERSON;
  const totalCosts = totalPayroll + hiringCosts;

  const netIncome = revenue - totalCosts;
  const cashAfter = cash + netIncome;

  return {
    revenue: Math.round(revenue),
    units_sold: unitsSold,
    total_costs: Math.round(totalCosts),
    net_income: Math.round(netIncome),
    cash_after: Math.round(cashAfter),
    engineers_after: engineersAfterHire,
    sales_after: salesAfterHire,
    quality_after: Math.round(qualityAfter),
  };
}
