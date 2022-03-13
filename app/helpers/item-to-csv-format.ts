import type { Currency, WeightUnit } from "db";
import type { CurrencySign } from "./sign-to-currency";
import type { WeightSymbol } from "./weight-unit-to-symbol";

import weightUnitToSymbol from "./weight-unit-to-symbol";
import { gToOz, withDecimalPlaces } from "./display-weight";
import displayCurrency from "./display-currency";

export type ParsedCsvItem = {
  worn?: boolean | null;
  quantity?: number | null;
  notes?: string | null;
  gear: {
    name: string;
    weight: number;
    price: number | null;
    currency: Currency;
    consumable: boolean;
    link: string | null;
    notes: string | null;
    imageUrl: string | null;
  };
};

export type CsvItem = {
  name: string;
  category: string;
  weight: number;
  unit: WeightSymbol;
  notes: string | null;
  price: number | null;
  currency: CurrencySign;
  link: string | null;
  image: string | null;
  consumable: string | null;
  worn: string | null;
  quantity: number;
};

const itemToCsvFormat = ({
  category,
  item,
  weightUnit = "METRIC",
}: {
  category: string;
  item: ParsedCsvItem;
  weightUnit?: WeightUnit;
}): CsvItem => {
  return {
    name: item.gear.name,
    category: category,
    weight: withDecimalPlaces(
      weightUnit === "METRIC" ? item.gear.weight : gToOz(item.gear.weight)
    ),
    unit: weightUnitToSymbol(weightUnit),
    notes: item.notes || item.gear.notes,
    price: item.gear.price && item.gear.price / 100,
    currency: displayCurrency(item.gear.currency),
    link: item.gear.link,
    image: item.gear.imageUrl,
    consumable: item.gear.consumable ? "consumable" : null,
    worn: item.worn ? "worn" : null,
    quantity: item.quantity || 1,
  };
};

export default itemToCsvFormat;
