import type { FC } from "react";

import { useContext } from "react";

import { HStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Icon } from "@chakra-ui/icon";
import { useToast } from "@chakra-ui/toast";
import { MenuItem, MenuList } from "@chakra-ui/menu";
import { FaArrowRight, FaEdit, FaShare } from "react-icons/fa";
import { FcDoughnutChart } from "react-icons/fc";

import SettingsMenuButton from "app/modules/common/components/settings-menu-button";

import packShareLink from "../helpers/pack-share-link";
import packContext from "../contexts/pack-context";

const PackSubheaderActions: FC = () => {
  const toast = useToast();

  const { pack, showDetails, editPack, share } = useContext(packContext);

  const copyShareLink = () => {
    navigator.clipboard.writeText(packShareLink(pack.id)).then(() => {
      toast({
        title: "Share link copied.",
        description:
          "A share link for your pack has been copied to your clipboard.",
        status: "success",
      });
    });
  };

  return (
    <HStack>
      {!share && (
        <SettingsMenuButton>
          <MenuList>
            <MenuItem icon={<FaEdit />} onClick={editPack}>
              Edit
            </MenuItem>
            <MenuItem icon={<FaShare />} onClick={copyShareLink}>
              Share
            </MenuItem>
          </MenuList>
        </SettingsMenuButton>
      )}

      <Button
        size="sm"
        leftIcon={<Icon w={6} h={6} as={FcDoughnutChart} />}
        rightIcon={<Icon w={3} h={3} as={FaArrowRight} />}
        fontWeight="bold"
        variant="outline"
        colorScheme="blue"
        onClick={showDetails}
      >
        Details
      </Button>
    </HStack>
  );
};

export default PackSubheaderActions;
