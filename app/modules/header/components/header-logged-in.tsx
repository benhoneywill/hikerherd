import type { FC } from "react";

import { HStack } from "@chakra-ui/layout";

import HeaderUserMenu from "./header-user-menu";

const HeaderLoggedIn: FC = () => {
  return (
    <HStack spacing={1} justify="flex-end">
      <HeaderUserMenu />
    </HStack>
  );
};

export default HeaderLoggedIn;
