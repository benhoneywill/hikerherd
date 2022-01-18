import { useContext } from "react";

import userPreferencesContext from "../contexts/user-preferences-context";

const useUserPreferences = () => {
  return useContext(userPreferencesContext);
};

export default useUserPreferences;
