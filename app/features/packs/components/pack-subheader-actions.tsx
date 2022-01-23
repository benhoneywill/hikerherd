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
import { FaChevronDown, FaCog, FaEdit, FaShare } from "react-icons/fa";
import { FcDoughnutChart } from "react-icons/fc";

import useCurrentUser from "app/features/users/hooks/use-current-user";

import packShareLink from "../helpers/pack-share-link";
import packContext from "../contexts/pack-context";

const PackSubheaderActions: FC = () => {
  const toast = useToast();
  const user = useCurrentUser({ suspense: false });

  const { pack, showDetails, editPack } = useContext(packContext);

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
      {pack && pack.userId === user?.id && (
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
        color="blue.500"
        fontWeight="bold"
        colorScheme="blue"
        variant="outline"
        onClick={showDetails}
      >
        Details
      </Button>
    </HStack>
  );
};

export default PackSubheaderActions;
