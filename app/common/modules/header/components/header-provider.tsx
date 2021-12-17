import type { FC } from "react";

import { useState } from "react";

import headerContext from "../contexts/header-context";

const { Provider } = headerContext;

const HeaderProvider: FC = ({ children }) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [searchIsOpen, setSearchIsOpen] = useState(false);

  const toggleDrawer = () => setDrawerIsOpen((state) => !state);
  const toggleSearch = () => setSearchIsOpen((state) => !state);

  return (
    <Provider
      value={{
        drawerIsOpen,
        toggleDrawer,

        searchIsOpen,
        toggleSearch,
      }}
    >
      {children}
    </Provider>
  );
};

export default HeaderProvider;
