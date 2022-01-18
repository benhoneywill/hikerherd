import { createContext } from "react";

type HeaderContext = {
  drawerIsOpen: boolean;
  toggleDrawer: () => void;
};

const headerContext = createContext<HeaderContext>({} as HeaderContext);

export default headerContext;
