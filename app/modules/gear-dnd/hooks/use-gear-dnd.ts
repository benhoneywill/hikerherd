import { useContext } from "react";

import gearDndContext from "../contexts/gear-dnd-context";

const useGearDnd = () => {
  return useContext(gearDndContext);
};

export default useGearDnd;
