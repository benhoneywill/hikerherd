import type { FC } from "react";
import type { IconType } from "react-icons";

import { Link, Routes, useQuery } from "blitz";

import { Heading, HStack } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/icon";
import { Button } from "@chakra-ui/button";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import { FaChevronDown } from "react-icons/fa";
import { FcList, FcRating, FcTimeline } from "react-icons/fc";

import packsQuery from "../queries/packs-query";

type PackPickerProps = {
  icon: IconType;
  title: string;
};

const PackPicker: FC<PackPickerProps> = ({ icon, title }) => {
  const [packs] = useQuery(packsQuery, {}, { suspense: false });

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
          <Heading size="sm" isTruncated>
            {title}
          </Heading>
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

        <MenuDivider />

        {packs?.map((pack) => (
          <Link
            key={pack.id}
            href={Routes.PackPage({ packId: pack.id })}
            passHref
          >
            <MenuItem as="a" icon={<FcTimeline />}>
              {pack.name}
            </MenuItem>
          </Link>
        ))}
      </MenuList>
    </Menu>
  );
};

export default PackPicker;
