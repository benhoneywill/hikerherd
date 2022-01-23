import type { FC } from "react";

import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerCloseButton,
} from "@chakra-ui/modal";
import { useColorModeValue } from "@chakra-ui/react";

import Navigation from "app/modules/common/components/navigation";

type HeaderDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const HeaderDrawer: FC<HeaderDrawerProps> = ({ isOpen, onClose }) => {
  const bg = useColorModeValue("white", "gray.800");

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="left">
      <DrawerOverlay />
      <DrawerContent bg={bg} py={6}>
        <DrawerCloseButton onClose={onClose} zIndex={2} />
        <DrawerBody>
          <Navigation />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default HeaderDrawer;
