import type { FC } from "react";

import { useState } from "react";

import headerContext from "../contexts/header-context";

const { Provider } = headerContext;

const HeaderProvider: FC = ({ children }) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const toggleDrawer = () => setDrawerIsOpen((state) => !state);

  return (
    <Provider
      value={{
        drawerIsOpen,
        toggleDrawer,
      }}
    >
      {children}
    </Provider>
  );
};

export default HeaderProvider;
