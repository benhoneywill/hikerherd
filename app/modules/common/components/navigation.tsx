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
  FcSearch,
  FcSettings,
  FcVoicePresentation,
  FcKindle,
} from "react-icons/fc";
import { Icon } from "@chakra-ui/icon";
import { useColorModeValue } from "@chakra-ui/react";

type NavigationItemProps = {
  route: RouteUrlObject;
  icon: IconType;
};

const NavigationItem: FC<NavigationItemProps> = ({ children, icon, route }) => {
  const router = useRouter();
  const isActive = router.pathname === route.pathname;

  const bgColor = useColorModeValue("gray.50", "gray.700");
  const activeBgColor = useColorModeValue("gray.50", "gray.900");
  const activeColor = useColorModeValue("blue.400", "cyan.400");

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

type NavigationExternalItemProps = {
  href: string;
  icon: IconType;
};

const NavigationExternalItem: FC<NavigationExternalItemProps> = ({
  children,
  icon,
  href,
}) => {
  const bgColor = useColorModeValue("gray.50", "gray.700");

  return (
    <HStack
      as="a"
      href={href}
      _hover={{ bg: bgColor }}
      borderRadius="md"
      display="flex"
      alignItems="center"
      py={2}
      px={3}
    >
      <Icon as={icon} w={5} h={5} mr={1} />
      <Text fontWeight="bold">{children}</Text>
    </HStack>
  );
};

const NavigationSection: FC<{ title: string }> = ({ title, children }) => {
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

const Navigation: FC = () => {
  return (
    <Box as="aside">
      <Stack as="aside" spacing={8}>
        <NavigationSection title="hikerherd">
          <NavigationItem route={Routes.HomePage()} icon={FcHome}>
            Home
          </NavigationItem>
          <NavigationItem route={Routes.DiscoverPage()} icon={FcSearch}>
            Discover
          </NavigationItem>
        </NavigationSection>

        <NavigationSection title="Gear tools">
          <NavigationItem route={Routes.InventoryPage()} icon={FcList}>
            Inventory
          </NavigationItem>
          <NavigationItem route={Routes.WishListPage()} icon={FcRating}>
            Wish list
          </NavigationItem>
          <NavigationItem route={Routes.PacksPage()} icon={FcTimeline}>
            Packs
          </NavigationItem>
        </NavigationSection>

        <NavigationSection title="User settings">
          <NavigationItem route={Routes.PreferencesPage()} icon={FcSettings}>
            Preferences
          </NavigationItem>
        </NavigationSection>

        <NavigationSection title="Other">
          <NavigationExternalItem
            href="https://blog.hikerherd.com"
            icon={FcKindle}
          >
            Newsletter
          </NavigationExternalItem>
          <NavigationExternalItem
            href="https://blog.hikerherd.com/contact"
            icon={FcVoicePresentation}
          >
            Contact
          </NavigationExternalItem>
        </NavigationSection>
      </Stack>
    </Box>
  );
};

export default Navigation;
