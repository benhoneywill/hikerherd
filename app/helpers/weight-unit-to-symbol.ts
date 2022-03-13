import type { WeightUnit } from "db";

export type WeightSymbol = "gram" | "ounce";

const weightUnitToSymbol = (unit: WeightUnit) => {
  switch (unit) {
    case "METRIC":
      return "gram";
    case "IMPERIAL":
      return "ounce";
  }
};

export default weightUnitToSymbol;
