import type { FC } from "react";
import type { IconType } from "react-icons";

import { Link, Routes } from "blitz";

import {
  Button,
  Heading,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";
import { FcList, FcRating } from "react-icons/fc";

type TypePickerProps = {
  icon: IconType;
  title: string;
};

const TypePicker: FC<TypePickerProps> = ({ icon, title }) => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        size="sm"
        variant="ghost"
        px={1}
        rightIcon={<Icon pr={1} as={FaChevronDown} />}
      >
        <HStack>
          <Icon as={icon} w={5} h={5} />
          <Heading size="sm">{title}</Heading>
        </HStack>
      </MenuButton>

      <MenuList>
        <Link href={Routes.InventoryPage()} passHref>
          <MenuItem as="a" icon={<FcList />}>
            Inventory
          </MenuItem>
        </Link>
        <Link href={Routes.WishListPage()} passHref>
          <MenuItem as="a" icon={<FcRating />}>
            Wish list
          </MenuItem>
        </Link>
      </MenuList>
    </Menu>
  );
};

export default TypePicker;
