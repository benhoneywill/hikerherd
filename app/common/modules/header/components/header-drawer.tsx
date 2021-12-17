import type { FC } from "react";

import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerCloseButton,
  DrawerHeader,
} from "@chakra-ui/modal";

import SidebarNav from "../../../components/sidebar-nav";
import useHeader from "../hooks/use-header";

const HeaderDrawer: FC = () => {
  const { drawerIsOpen, toggleDrawer } = useHeader();

  return (
    <Drawer isOpen={drawerIsOpen} onClose={toggleDrawer} placement="left">
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

export default HeaderDrawer;
