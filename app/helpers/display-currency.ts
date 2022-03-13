import type { Currency } from "db";

const displayCurrency = (currency?: Currency) => {
  switch (currency) {
    case "GBP":
      return "£";
    case "EUR":
      return "€";
    default:
      return "$";
  }
};

export default displayCurrency;
