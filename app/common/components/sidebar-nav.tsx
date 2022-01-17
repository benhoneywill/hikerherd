import type { FC } from "react";
import type { RouteUrlObject } from "blitz";
import type { IconType } from "react-icons";

import { Link, Routes, useRouter } from "blitz";

import { Stack, HStack, Text, Heading, Box } from "@chakra-ui/layout";
import {
  FcHome,
  FcList,
  FcRating,
  FcTimeline,
  FcPortraitMode,
  FcSearch,
  FcSettings,
} from "react-icons/fc";
import { Icon } from "@chakra-ui/icon";
import { useColorModeValue } from "@chakra-ui/react";

type SidebarNavItemProps = {
  route: RouteUrlObject;
  icon: IconType;
};

const SidebarNavItem: FC<SidebarNavItemProps> = ({ children, icon, route }) => {
  const router = useRouter();
  const isActive = router.pathname === route.pathname;

  const bgColor = useColorModeValue("gray.50", "gray.700");
  const activeBgColor = useColorModeValue("cyan.50", "gray.900");
  const activeColor = useColorModeValue("cyan.900", "cyan.300");

  return (
    <Link href={route} passHref>
      <HStack
        as="a"
        bg={isActive ? activeBgColor : "transparent"}
        _hover={{ bg: isActive ? activeBgColor : bgColor }}
        borderRadius="md"
        py={2}
        px={3}
      >
        <Icon as={icon} w={5} h={5} mr={1} />
        <Text color={isActive ? activeColor : ""} fontWeight="bold">
          {children}
        </Text>
      </HStack>
    </Link>
  );
};

const SidebarNavSection: FC<{ title: string }> = ({ title, children }) => {
  return (
    <Stack as="section" spacing={2}>
      <Heading
        fontSize="xs"
        pl={3}
        textTransform="uppercase"
        pb={2}
        color="gray.500"
      >
        {title}
      </Heading>

      {children}
    </Stack>
  );
};

const SidebarNav: FC = () => {
  return (
    <Box as="aside" position="sticky" top="0">
      <Stack as="aside" spacing={8}>
        <SidebarNavSection title="hikerherd">
          <SidebarNavItem route={Routes.HomePage()} icon={FcHome}>
            Home
          </SidebarNavItem>
          <SidebarNavItem route={Routes.DiscoverPage()} icon={FcSearch}>
            Discover
          </SidebarNavItem>
        </SidebarNavSection>

        <SidebarNavSection title="Gear tools">
          <SidebarNavItem route={Routes.InventoryPage()} icon={FcList}>
            Inventory
          </SidebarNavItem>
          <SidebarNavItem route={Routes.WishListPage()} icon={FcRating}>
            Wish list
          </SidebarNavItem>
          <SidebarNavItem route={Routes.PacksPage()} icon={FcTimeline}>
            Packs
          </SidebarNavItem>
        </SidebarNavSection>

        <SidebarNavSection title="User settings">
          <SidebarNavItem route={Routes.MyProfilePage()} icon={FcPortraitMode}>
            My Profile
          </SidebarNavItem>
          <SidebarNavItem route={Routes.MyProfilePage()} icon={FcSettings}>
            My Settings
          </SidebarNavItem>
        </SidebarNavSection>
      </Stack>
    </Box>
  );
};

export default SidebarNav;
