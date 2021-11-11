import type { FC } from "react";

import { useSession, Link, Routes, useMutation } from "blitz";
import { Suspense } from "react";

import { Flex, HStack, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Avatar } from "@chakra-ui/avatar";
import { Fade } from "@chakra-ui/transition";
import { Menu, MenuList, MenuItem, MenuButton } from "@chakra-ui/menu";
import { FaArrowRight, FaChevronDown, FaSignOutAlt, FaUserAlt } from "react-icons/fa";
import Icon from "@chakra-ui/icon";
import { SkeletonCircle } from "@chakra-ui/skeleton";

import { useCurrentUser } from "app/users/hooks/use-current-user";
import logoutMutation from "app/auth/mutations/logout-mutation";

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

export const Header: FC = () => {
  const session = useSession({ suspense: false });
  const isLoggedIn = !!session.userId;
  const isLoggedOut = !session.userId && !session.isLoading;

  return (
    <Flex
      align="center"
      justify="space-between"
      as="header"
      borderBottom="2px solid"
      borderColor="gray.100"
      bg="white"
      p={3}
      h={14}
    >
      {isLoggedOut && (
        <Link href={Routes.LoginPage()} passHref>
          <Button colorScheme="blue" size="sm" as="a" rightIcon={<FaArrowRight />}>
            Get started
          </Button>
        </Link>
      )}

      {isLoggedIn && (
        <Suspense fallback={<SkeletonCircle mx={1} size="6" />}>
          <Menu>
            <UserMenuButton />
            <UserMenu />
          </Menu>
        </Suspense>
      )}
    </Flex>
  );
};
