import { useContext } from "react";

import headerContext from "../contexts/header-context";

const useHeader = () => {
  return useContext(headerContext);
};

export default useHeader;
