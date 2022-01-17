import type { FC } from "react";

import { Link, Routes, useQuery, useRouter } from "blitz";

import { Box, Container } from "@chakra-ui/layout";
import {
  Button,
  Heading,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";
import { FcList, FcRating, FcTimeline } from "react-icons/fc";

import packsQuery from "app/features/packs/queries/packs-query";
import packQuery from "app/features/packs/queries/pack-query";

import useModeColors from "../hooks/use-mode-colors";

type SubheaderProps = {
  inventory?: boolean;
  wishList?: boolean;
};

const Subheader: FC<SubheaderProps> = ({ inventory, wishList, children }) => {
  const router = useRouter();
  const { header } = useModeColors();

  const [packs] = useQuery(
    packsQuery,
    {},
    {
      suspense: false,
    }
  );

  const [pack] = useQuery(
    packQuery,
    { id: router.query.packId as string },
    {
      suspense: false,
      enabled: !!router.query.packId,
    }
  );

  let title = "Select";
  let icon = FcTimeline;

  if (inventory) {
    title = "Inventory";
    icon = FcList;
  }

  if (wishList) {
    title = "Wish list";
    icon = FcRating;
  }

  if (pack) {
    title = pack.name;
    icon = FcTimeline;
  }

  return (
    <Box
      borderBottom="1px solid"
      py={2}
      borderColor={header.border}
      bg={header.bg}
    >
      <Container maxW="100%">
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

          {children}
        </HStack>
      </Container>
    </Box>
  );
};

export default Subheader;
