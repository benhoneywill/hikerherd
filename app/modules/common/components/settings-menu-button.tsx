import type { FC } from "react";

import { IconButton } from "@chakra-ui/button";
import { Icon } from "@chakra-ui/icon";
import { Menu, MenuButton } from "@chakra-ui/menu";
import { FaChevronDown, FaCog } from "react-icons/fa";

const SettingsMenuButton: FC = ({ children }) => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="actions"
        size="sm"
        variant="outline"
        px={2}
        rightIcon={<Icon as={FaChevronDown} pr={1} mr={1} />}
        icon={<Icon as={FaCog} color="gray.500" w={5} h={5} pl={1} ml={1} />}
      />

      {children}
    </Menu>
  );
};

export default SettingsMenuButton;
