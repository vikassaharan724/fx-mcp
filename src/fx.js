/**
 * Currency rates via Frankfurter API (free, no API key).
 * https://www.frankfurter.app/
 */

export async function getExchangeRate(from, to, amount = 1) {
  const base = String(from ?? "").trim().toUpperCase();
  const target = String(to ?? "").trim().toUpperCase();
  const amt = Number(amount);
  if (!base || !target) throw new Error("from and to currency codes required");
  if (!Number.isFinite(amt) || amt <= 0) throw new Error("amount must be positive");

  const url = new URL(`https://api.frankfurter.app/latest`);
  url.searchParams.set("from", base);
  url.searchParams.set("to", target);
  url.searchParams.set("amount", String(amt));

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Frankfurter API failed: ${res.status}`);
  const data = await res.json();

  const rate = data.rates?.[target];
  if (rate == null) throw new Error(`No rate for ${base} → ${target}`);

  return [
    `Exchange: ${amt} ${base} = ${rate} ${target}`,
    `Rate date: ${data.date}`,
    `(Source: Frankfurter API, ECB data)`,
  ].join("\n");
}

export async function listSupportedCurrencies() {
  const res = await fetch("https://api.frankfurter.app/currencies");
  if (!res.ok) throw new Error(`Frankfurter API failed: ${res.status}`);
  const data = await res.json();
  const codes = Object.keys(data).sort();
  return [`Supported currencies (${codes.length}):`, codes.join(", "), "(Source: Frankfurter API)"].join("\n");
}
