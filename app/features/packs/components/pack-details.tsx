import type { FC } from "react";

import { useContext } from "react";

import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/modal";

import packContext from "../contexts/pack-context";

import PackAnalytics from "./pack-analytics";
import PackNotes from "./pack-notes";

type PackDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
};

const PackDetails: FC<PackDetailsProps> = ({ isOpen, onClose }) => {
  const { pack } = useContext(packContext);

  return (
    <Drawer placement="right" size="xl" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton onClose={onClose} zIndex={2} />
        <DrawerHeader borderBottomWidth="1px">{pack.name}</DrawerHeader>
        <DrawerBody p={0}>
          <PackAnalytics />
          <PackNotes />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default PackDetails;
