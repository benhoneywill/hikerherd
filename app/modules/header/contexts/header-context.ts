import { createContext } from "react";

type HeaderContext = {
  drawerIsOpen: boolean;
  toggleDrawer: () => void;

  searchIsOpen: boolean;
  toggleSearch: () => void;
};

const headerContext = createContext<HeaderContext>({} as HeaderContext);

export default headerContext;
