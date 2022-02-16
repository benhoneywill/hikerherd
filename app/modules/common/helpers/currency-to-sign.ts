import type { Currency } from "db";

export type CurrencySign = "$" | "£" | "€";

export const signToCurrency = (currency?: CurrencySign | null) => {
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

const currencyToSign = (currency: Currency) => {
  switch (currency) {
    case "USD":
      return "$";
    case "GBP":
      return "£";
    case "EUR":
      return "€";
  }
};

export default currencyToSign;
