import type { Currency } from "@prisma/client";

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
