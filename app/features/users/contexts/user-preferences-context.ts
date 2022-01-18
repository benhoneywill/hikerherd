import type { Currency, WeightUnit } from "@prisma/client";

import { createContext } from "react";

type UserPreferencesContext = {
  weightUnit: WeightUnit;
  toggleWeightUnits: () => void;
  currency: Currency;
};

const userPreferencesContext = createContext<UserPreferencesContext>(
  {} as UserPreferencesContext
);

export default userPreferencesContext;
