import type { FC } from "react";

import { Link, Routes, useQuery, useRouter } from "blitz";

import { HStack, Heading } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/icon";
import { FcList, FcTimeline, FcRating } from "react-icons/fc";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/menu";
import { Button } from "@chakra-ui/button";
import { FaChevronDown } from "react-icons/fa";

import Subheader from "app/common/components/subheader";
import packsQuery from "app/features/packs/queries/packs-query";

const InventorySubheader: FC = ({ children }) => {
  const router = useRouter();

  const [packs] = useQuery(
    packsQuery,
    {},
    {
      suspense: false,
    }
  );

  const isWishList = router.pathname === Routes.WishListPage().pathname;

  const icon = isWishList ? FcRating : FcList;
  const title = isWishList ? "Wish list" : "Inventory";

  return (
    <Subheader>
      <HStack justify="space-between">
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
            {(packs?.length || 0) > 0 && <MenuDivider />}
            {packs?.map((pack) => (
              <Link
                key={pack.id}
                href={Routes.PackPage({ id: pack.id })}
                passHref
              >
                <MenuItem as="a" icon={<FcTimeline />}>
                  {pack.name}
                </MenuItem>
              </Link>
            ))}
          </MenuList>
        </Menu>

        {children}
      </HStack>
    </Subheader>
  );
};

export default InventorySubheader;
