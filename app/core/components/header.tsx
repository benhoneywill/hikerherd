import type { FC } from "react";

import { useSession, Link, Routes, useMutation } from "blitz";
import { Suspense } from "react";

import { Box, HStack, Container, Grid, GridItem } from "@chakra-ui/layout";
import { Button, IconButton } from "@chakra-ui/button";
import { Avatar } from "@chakra-ui/avatar";
import { Fade } from "@chakra-ui/transition";
import { Menu, MenuList, MenuItem, MenuButton } from "@chakra-ui/menu";
import {
  FaArrowRight,
  FaChevronDown,
  FaSignOutAlt,
  FaUserAlt,
  FaSun,
  FaMoon,
  FaBars,
  FaBell,
  FaSearch,
} from "react-icons/fa";
import Icon from "@chakra-ui/icon";
import { SkeletonCircle } from "@chakra-ui/skeleton";
import { useColorMode } from "@chakra-ui/system";
import { useColorModeValue, useDisclosure } from "@chakra-ui/react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerCloseButton,
  DrawerHeader,
} from "@chakra-ui/modal";

import useCurrentUser from "app/users/hooks/use-current-user";
import logoutMutation from "app/auth/mutations/logout-mutation";

import useColorModeValues from "../theme/use-color-mode-values";

import SidebarNav from "./sidebar-nav";

const UserMenuLoader: FC = () => (
  <Button size="sm" variant="ghost" px={1} rightIcon={<Icon pr={1} as={FaChevronDown} />}>
    <SkeletonCircle size="6" />
  </Button>
);

const UserMenuButton: FC = () => {
  const user = useCurrentUser();

  return (
    <Fade in={!!user}>
      <MenuButton
        as={Button}
        size="sm"
        variant="ghost"
        px={1}
        rightIcon={<Icon pr={1} as={FaChevronDown} />}
      >
        <Avatar size="xs" src={user?.avatar || ""} />
      </MenuButton>
    </Fade>
  );
};

const UserMenu: FC = () => {
  const [logout] = useMutation(logoutMutation);

  return (
    <MenuList>
      <Link href={Routes.MyProfilePage()} passHref>
        <MenuItem as="a" icon={<FaUserAlt />}>
          My profile
        </MenuItem>
      </Link>
      <MenuItem as="button" onClick={() => logout()} icon={<FaSignOutAlt />}>
        Logout
      </MenuItem>
    </MenuList>
  );
};

const NavMenu: FC<{ isOpen: boolean; toggle: () => void }> = ({ isOpen, toggle }) => {
  return (
    <Drawer isOpen={isOpen} onClose={toggle} placement="left">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>hikerherd</DrawerHeader>
        <DrawerBody>
          <SidebarNav />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const Header: FC = () => {
  const session = useSession({ suspense: false });
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen: menuIsOpen, onToggle: toggleMenu } = useDisclosure();
  const colors = useColorModeValues();

  const isLoggedIn = !!session.userId;
  const isLoggedOut = !session.userId && !session.isLoading;

  return (
    <Box as="header" py={3} bg={colors.card}>
      <NavMenu isOpen={menuIsOpen} toggle={toggleMenu} />

      <Container maxW="container.lg">
        <Grid
          templateColumns={{ base: "auto 1fr 1fr", md: "1fr auto 1fr" }}
          alignItems="center"
          gap={3}
        >
          <GridItem>
            <HStack spacing={1}>
              <IconButton
                size="sm"
                variant="ghost"
                aria-label="Open menu"
                onClick={toggleMenu}
                icon={<Icon as={FaBars} w={5} h={5} />}
              />
              <IconButton
                size="sm"
                variant="ghost"
                aria-label="Open menu"
                icon={<Icon as={FaSearch} w={5} h={5} />}
              />
              <IconButton
                size="sm"
                variant="ghost"
                aria-label="Toggle dark mode"
                icon={<Icon as={colorMode === "dark" ? FaSun : FaMoon} w={5} h={5} />}
                onClick={toggleColorMode}
              />
            </HStack>
          </GridItem>

          <GridItem justify={{ base: "flex-start", md: "center" }} order={{ base: -1, md: 0 }}>
            <Link href={Routes.HomePage()} passHref>
              <Box
                as="a"
                display="block"
                bgImage={`/images/logo-${useColorModeValue("dark", "light")}.svg`}
                bgSize="auto 100%"
                height={{ base: 8, md: 6 }}
                width={{ base: 8, md: "121px" }}
              />
            </Link>
          </GridItem>

          <GridItem>
            <HStack spacing={1} justify="flex-end">
              {isLoggedOut && (
                <>
                  <Link href={Routes.LoginPage()} passHref>
                    <Button size="sm" as="a" variant="ghost">
                      Log in
                    </Button>
                  </Link>
                  <Link href={Routes.SignupPage()} passHref>
                    <Button size="sm" as="a" rightIcon={<FaArrowRight />}>
                      Get started
                    </Button>
                  </Link>
                </>
              )}

              {isLoggedIn && (
                <>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label="Open menu"
                    icon={<Icon as={FaBell} w={5} h={5} />}
                  />
                  <Suspense fallback={<UserMenuLoader />}>
                    <Menu>
                      <UserMenuButton />
                      <UserMenu />
                    </Menu>
                  </Suspense>
                </>
              )}
            </HStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default Header;
