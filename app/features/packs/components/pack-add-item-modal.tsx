import type { FC } from "react";

import { useMutation } from "blitz";

import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/modal";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";
import { Icon } from "@chakra-ui/icon";
import { FcPlus, FcList, FcRating, FcSearch } from "react-icons/fc";
import { HStack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/react";

import useModeColors from "app/common/hooks/use-mode-colors";

import addGearToPackMutation from "../mutations/add-gear-to-pack-mutation";

import PackAddInventoryItem from "./pack-add-inventory-item";
import PackSearchAdd from "./pack-search-add";

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
  const { gray } = useModeColors();
  const toast = useToast();

  const addToPack = async (gearId: string) => {
    if (categoryId) {
      await addGearToPack({ gearId, packId, categoryId });
      onAdd();
      toast({
        title: "Success",
        description: "The item has been added to your pack.",
        status: "success",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalBody p={0}>
          <Tabs isFitted>
            <TabList
              position="sticky"
              top={0}
              zIndex={3}
              bg={gray[100]}
              borderTopLeftRadius="md"
              borderTopRightRadius="md"
              overflowX="auto"
              overflowY="hidden"
            >
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
              <Tab py={4} flexShrink={0}>
                <HStack>
                  <Icon as={FcPlus} />
                  <Text whiteSpace="nowrap" overflow="hidden">
                    New
                  </Text>
                </HStack>
              </Tab>
              <Tab py={4} flexShrink={0}>
                <HStack>
                  <Icon as={FcSearch} />
                  <Text whiteSpace="nowrap" overflow="hidden">
                    Discover
                  </Text>
                </HStack>
              </Tab>
            </TabList>

            <TabPanels bg={gray[50]}>
              <TabPanel>
                <PackAddInventoryItem type="INVENTORY" addToPack={addToPack} />
              </TabPanel>
              <TabPanel>
                <PackAddInventoryItem type="WISH_LIST" addToPack={addToPack} />
              </TabPanel>
              <TabPanel></TabPanel>
              <TabPanel>
                <PackSearchAdd addToPack={addToPack} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PackAddItemModal;
