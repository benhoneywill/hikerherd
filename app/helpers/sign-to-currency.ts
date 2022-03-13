import type { Currency } from "db";

export type CurrencySign = "$" | "£" | "€";

const signToCurrency = (currency?: CurrencySign | null | ""): Currency => {
  switch (currency) {
    case "$":
      return "USD";
    case "£":
      return "GBP";
    case "€":
      return "EUR";
    default:
      return "USD";
  }
};

export default signToCurrency;
