import type { FC } from "react";

import { Link, Routes, useMutation } from "blitz";
import { Suspense } from "react";

import { Button } from "@chakra-ui/button";
import { Avatar } from "@chakra-ui/avatar";
import { Fade } from "@chakra-ui/transition";
import { Menu, MenuList, MenuItem, MenuButton } from "@chakra-ui/menu";
import Icon from "@chakra-ui/icon";
import { SkeletonCircle } from "@chakra-ui/skeleton";
import { FaChevronDown, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Portal } from "@chakra-ui/react";

import useCurrentUser from "app/features/users/hooks/use-current-user";
import logoutMutation from "app/features/auth/mutations/logout-mutation";

const UserMenuLoader: FC = () => (
  <Button
    size="sm"
    variant="ghost"
    px={1}
    rightIcon={<Icon pr={1} as={FaChevronDown} />}
  >
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

const HeaderUserMenu: FC = () => {
  const [logout] = useMutation(logoutMutation);

  return (
    <Suspense fallback={<UserMenuLoader />}>
      <Menu>
        <UserMenuButton />

        <Portal>
          <MenuList>
            <Link href={Routes.SettingsPage()} passHref>
              <MenuItem as="a" icon={<FaCog />}>
                My settings
              </MenuItem>
            </Link>
            <MenuItem
              as="button"
              onClick={() => logout()}
              icon={<FaSignOutAlt />}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Portal>
      </Menu>
    </Suspense>
  );
};

export default HeaderUserMenu;