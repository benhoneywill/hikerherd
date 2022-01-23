import type { FC } from "react";

import { useContext } from "react";

import { HStack } from "@chakra-ui/layout";
import {
  FaSun,
  FaMoon,
  FaBars,
  FaFlagUsa,
  FaGlobeEurope,
} from "react-icons/fa";
import Icon from "@chakra-ui/icon";
import { useColorMode } from "@chakra-ui/react";

import userPreferencesContext from "app/features/users/contexts/user-preferences-context";

import HeaderIconButton from "./header-icon-button";

type HeaderActionsProps = {
  toggleDrawer: () => void;
};

const HeaderActions: FC<HeaderActionsProps> = ({ toggleDrawer }) => {
  const { toggleWeightUnits, weightUnit } = useContext(userPreferencesContext);
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <HStack spacing={1}>
      <HeaderIconButton
        label="Open menu"
        onClick={toggleDrawer}
        icon={<Icon as={FaBars} w={5} h={5} />}
      />
      <HeaderIconButton
        label={colorMode === "dark" ? "Day hike" : "Night hike"}
        onClick={toggleColorMode}
        icon={<Icon as={colorMode === "dark" ? FaSun : FaMoon} w={5} h={5} />}
      />
      <HeaderIconButton
        label={
          weightUnit === "METRIC" ? "Use imperial units" : "Use metric units"
        }
        onClick={toggleWeightUnits}
        icon={
          <Icon
            as={weightUnit === "METRIC" ? FaFlagUsa : FaGlobeEurope}
            w={5}
            h={5}
          />
        }
      />
    </HStack>
  );
};

export default HeaderActions;
