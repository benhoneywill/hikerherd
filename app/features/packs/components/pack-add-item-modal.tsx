import type { FC } from "react";

import { useMutation } from "blitz";

import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/modal";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";
import { Icon } from "@chakra-ui/icon";
import { FcList, FcRating } from "react-icons/fc";
import { HStack, Text } from "@chakra-ui/layout";

import addGearToPackMutation from "../mutations/add-gear-to-pack-mutation";

import PackAddInventoryItem from "./pack-add-inventory-item";

type PackAddItemModalProps = {
  packId: string;
  categoryId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
};

const PackAddItemModal: FC<PackAddItemModalProps> = ({
  categoryId,
  packId,
  isOpen,
  onClose,
  onAdd,
}) => {
  const [addGearToPack] = useMutation(addGearToPackMutation);

  const addToPack = async (gearId: string) => {
    if (categoryId) {
      await addGearToPack({ gearId, packId, categoryId });
      onClose();
      onAdd();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalBody p={0}>
          <Tabs isFitted>
            <TabList position="sticky" top={0} zIndex={3} bg="white">
              <Tab py={4} flexShrink={0}>
                <HStack>
                  <Icon as={FcList} />
                  <Text whiteSpace="nowrap" overflow="hidden">
                    Inventory
                  </Text>
                </HStack>
              </Tab>
              <Tab py={4} flexShrink={0}>
                <HStack>
                  <Icon as={FcRating} />
                  <Text whiteSpace="nowrap" overflow="hidden">
                    Wish list
                  </Text>
                </HStack>
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <PackAddInventoryItem type="INVENTORY" addToPack={addToPack} />
              </TabPanel>
              <TabPanel>
                <PackAddInventoryItem type="WISH_LIST" addToPack={addToPack} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PackAddItemModal;
