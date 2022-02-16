import type { Currency, WeightUnit } from "db";
import type { CurrencySign } from "./currency-to-sign";
import type { WeightSymbol } from "./weight-unit-to-symbol";

import currencyToSign from "./currency-to-sign";
import weightUnitToSymbol from "./weight-unit-to-symbol";
import { gToOz, withDecimalPlaces } from "./display-weight";

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
  consumable: boolean;
  worn: boolean;
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
    currency: currencyToSign(item.gear.currency),
    link: item.gear.link,
    image: item.gear.imageUrl,
    consumable: item.gear.consumable,
    worn: item.worn || false,
    quantity: item.quantity || 1,
  };
};

export default itemToCsvFormat;
