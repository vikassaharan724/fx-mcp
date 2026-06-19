import * as z from "zod";
import { getExchangeRate, listSupportedCurrencies } from "./fx.js";

export function registerFxTools(server) {
  server.tool(
    "get_exchange_rate",
    "Convert amount between currencies using live ECB rates (Frankfurter API).",
    {
      from: z.string().describe("Source currency code, e.g. USD, EUR, GBP"),
      to: z.string().describe("Target currency code"),
      amount: z.number().optional().describe("Amount to convert, default 1"),
    },
    async ({ from, to, amount }) => {
      const text = await getExchangeRate(from, to, amount ?? 1);
      return { content: [{ type: "text", text }] };
    }
  );

  server.tool(
    "list_currencies",
    "List all supported currency codes.",
    {},
    async () => {
      const text = await listSupportedCurrencies();
      return { content: [{ type: "text", text }] };
    }
  );
}
