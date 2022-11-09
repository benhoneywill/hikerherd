import type { FC } from "react";

import { useEffect, useState } from "react";

import { WeightUnit, Currency } from "db";

import useCurrentUser from "../hooks/use-current-user";
import userPreferencesContext from "../contexts/user-preferences-context";

const UserPreferencesProvider: FC = ({ children }) => {
  const user = useCurrentUser({ suspense: false });

  const [weightUnit, setWeightUnit] = useState<WeightUnit>(
    user?.weightUnit || WeightUnit.METRIC
  );

  const [currency, setCurrency] = useState<Currency>(
    user?.currency || Currency.USD
  );

  useEffect(() => {
    if (user?.weightUnit) setWeightUnit(user.weightUnit);
    if (user?.currency) setCurrency(user.currency);
  }, [user]);

  const toggleWeightUnits = () => {
    const newWeightUnit =
      weightUnit === WeightUnit.METRIC
        ? WeightUnit.IMPERIAL
        : WeightUnit.METRIC;

    setWeightUnit(newWeightUnit);
  };

  return (
    <userPreferencesContext.Provider
      value={{
        weightUnit,
        toggleWeightUnits,
        currency,
        setCurrency,
        compact: !!user?.compact,
      }}
    >
      {children}
    </userPreferencesContext.Provider>
  );
};

export default UserPreferencesProvider;
