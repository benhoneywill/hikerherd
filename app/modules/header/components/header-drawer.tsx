import type { FC } from "react";

import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerCloseButton,
} from "@chakra-ui/modal";
import { useColorModeValue } from "@chakra-ui/react";

import SidebarNav from "app/common/components/sidebar-nav";

import useHeader from "../hooks/use-header";

const HeaderDrawer: FC = () => {
  const { drawerIsOpen, toggleDrawer } = useHeader();

  const bg = useColorModeValue("white", "gray.800");

  return (
    <Drawer isOpen={drawerIsOpen} onClose={toggleDrawer} placement="left">
      <DrawerOverlay />
      <DrawerContent bg={bg} py={6}>
        <DrawerCloseButton onClose={toggleDrawer} zIndex={2} />
        <DrawerBody>
          <SidebarNav />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default HeaderDrawer;
