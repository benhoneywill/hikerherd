import type { FC } from "react";

import { HStack } from "@chakra-ui/layout";
import { FaBell } from "react-icons/fa";
import Icon from "@chakra-ui/icon";

import HeaderIconButton from "./header-icon-button";
import HeaderUserMenu from "./header-user-menu";

const HeaderLoggedIn: FC = () => {
  return (
    <HStack spacing={1} justify="flex-end">
      <HeaderIconButton
        label="Notifictions"
        onClick={() => null}
        icon={<Icon as={FaBell} w={5} h={5} />}
      />
      <HeaderUserMenu />
    </HStack>
  );
};

export default HeaderLoggedIn;
