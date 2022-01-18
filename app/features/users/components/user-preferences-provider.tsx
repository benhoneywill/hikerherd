import type { FC } from "react";

import { useEffect, useState } from "react";

import { WeightUnit } from "@prisma/client";

import userPreferencesContext from "../contexts/user-preferences-context";
import useCurrentUser from "../hooks/use-current-user";

const { Provider } = userPreferencesContext;

const UserPreferencesProvider: FC = ({ children }) => {
  const user = useCurrentUser({ suspense: false });

  const [weightUnit, setWeightUnit] = useState<WeightUnit>(
    user?.weightUnit || WeightUnit.METRIC
  );

  useEffect(() => {
    if (user?.weightUnit) {
      setWeightUnit(user.weightUnit);
    }
  }, [user?.weightUnit]);

  const toggleWeightUnits = () => {
    if (weightUnit === WeightUnit.METRIC) {
      setWeightUnit(WeightUnit.IMPERIAL);
    } else {
      setWeightUnit(WeightUnit.METRIC);
    }
  };

  return (
    <Provider
      value={{
        weightUnit,
        toggleWeightUnits,
        currency: user?.currency || "USD",
      }}
    >
      {children}
    </Provider>
  );
};

export default UserPreferencesProvider;
