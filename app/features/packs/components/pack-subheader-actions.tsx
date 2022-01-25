import type { FC } from "react";

import { useContext } from "react";

import { HStack } from "@chakra-ui/layout";
import {
  Button,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import {
  FaArrowRight,
  FaChevronDown,
  FaCog,
  FaEdit,
  FaShare,
} from "react-icons/fa";
import { FcDoughnutChart } from "react-icons/fc";

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
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="actions"
            size="sm"
            variant="outline"
            px={2}
            rightIcon={<Icon as={FaChevronDown} pr={1} mr={1} />}
            icon={
              <Icon as={FaCog} color="gray.500" w={5} h={5} pl={1} ml={1} />
            }
          />

          <MenuList>
            <MenuItem icon={<FaEdit />} onClick={editPack}>
              Edit
            </MenuItem>
            <MenuItem icon={<FaShare />} onClick={copyShareLink}>
              Share
            </MenuItem>
          </MenuList>
        </Menu>
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
