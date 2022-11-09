import type { Currency, WeightUnit } from "db";

import { createContext } from "react";

type UserPreferencesContext = {
  weightUnit: WeightUnit;
  toggleWeightUnits: () => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  compact: boolean;
};

const userPreferencesContext = createContext<UserPreferencesContext>(
  {} as UserPreferencesContext
);

export default userPreferencesContext;
