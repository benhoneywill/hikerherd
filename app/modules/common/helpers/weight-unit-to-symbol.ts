import type { WeightUnit } from "db";

export type WeightSymbol = "g" | "oz";

const weightUnitToSymbol = (unit: WeightUnit) => {
  switch (unit) {
    case "METRIC":
      return "g";
    case "IMPERIAL":
      return "oz";
  }
};

export default weightUnitToSymbol;
