import type { FC } from "react";

import { useEffect } from "react";
import { useRouter } from "blitz";

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
  const router = useRouter();
  const bg = useColorModeValue("white", "#242c3a");

  useEffect(() => {
    onClose();
  }, [router.pathname]); // eslint-disable-line

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
