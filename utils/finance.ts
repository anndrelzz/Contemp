/**
 * Converts a Brazilian currency string like "R$ 63.692,54" to a float 63692.54
 */
export function parseBRLToFloat(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  const str = String(value);
  if (!str.trim()) return 0;
  const cleaned = str
    .replace(/R\$\s*/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();
  return parseFloat(cleaned) || 0;
}

/**
 * Calculates the monthly interest rate using Newton-Raphson method.
 * Equivalent to Excel's =RATE(nper, pmt, pv, fv)
 * @param nper - Number of periods (prazo)
 * @param pmt  - Payment per period (parcela)
 * @param pv   - Present value (-dn, negative)
 * @param fv   - Future value (0)
 */
export function calcularTaxaMensal(
  nper: number,
  pmt: number,
  pv: number,
  fv = 0
): number {
  if (nper <= 0 || pmt <= 0 || pv === 0) return 0;

  // Initial guess
  let rate = 0.01;
  const tolerance = 1e-7;
  const maxIterations = 1000;

  for (let i = 0; i < maxIterations; i++) {
    const rPow = Math.pow(1 + rate, nper);
    // f(rate) = pv*(1+rate)^n + pmt*[(1+rate)^n - 1]/rate + fv
    const f =
      pv * rPow + pmt * ((rPow - 1) / rate) + fv;
    // f'(rate)
    const df =
      pv * nper * Math.pow(1 + rate, nper - 1) +
      pmt *
        ((nper * Math.pow(1 + rate, nper - 1) * rate - (rPow - 1)) /
          (rate * rate));

    const newRate = rate - f / df;

    if (Math.abs(newRate - rate) < tolerance) {
      return newRate * 100; // Return as percentage
    }
    rate = newRate;
  }

  return rate * 100;
}

/**
 * Formats a number as Brazilian currency: R$ 1.234,56
 */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Formats a number as percentage with 2 decimal places: 44.23%
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}
