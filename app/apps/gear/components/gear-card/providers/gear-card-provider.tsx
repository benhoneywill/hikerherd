import type { FC } from "react";
import type { GearCardContext } from "../contexts/gear-card-context";

import gearCardContext from "../contexts/gear-card-context";

const { Provider } = gearCardContext;

const GearCardProvider: FC<GearCardContext> = ({ children, ...props }) => {
  return <Provider value={props}>{children}</Provider>;
};

export default GearCardProvider;
