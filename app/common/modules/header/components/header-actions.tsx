import type { FC } from "react";

import { HStack } from "@chakra-ui/layout";
import { FaSun, FaMoon, FaBars, FaSearch } from "react-icons/fa";
import Icon from "@chakra-ui/icon";
import { useColorMode } from "@chakra-ui/react";

import useHeader from "../hooks/use-header";

import HeaderIconButton from "./header-icon-button";

const HeaderActions: FC = () => {
  const { toggleDrawer, toggleSearch } = useHeader();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <HStack spacing={1}>
      <HeaderIconButton
        label="Open menu"
        onClick={toggleDrawer}
        icon={<Icon as={FaBars} w={5} h={5} />}
      />
      <HeaderIconButton
        label="Search"
        onClick={toggleSearch}
        icon={<Icon as={FaSearch} w={5} h={5} />}
      />
      <HeaderIconButton
        label={colorMode === "dark" ? "Day hike" : "Night hike"}
        onClick={toggleColorMode}
        icon={<Icon as={colorMode === "dark" ? FaSun : FaMoon} w={5} h={5} />}
      />
    </HStack>
  );
};

export default HeaderActions;
