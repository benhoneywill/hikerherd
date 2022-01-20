import type { FC } from "react";
import type { CategoryType } from "@prisma/client";

import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/modal";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";
import { Icon } from "@chakra-ui/icon";
import { FcPlus, FcSearch } from "react-icons/fc";
import { HStack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/react";

import useModeColors from "app/common/hooks/use-mode-colors";

import ManualAddTab from "./manual-add-tab";
import SearchAddTab from "./search-add-tab";

type AddItemToCategoryProps = {
  categoryId: string | null;
  isOpen: boolean;
  onClose: () => void;
  type: CategoryType;
  onAdd: () => void;
};

const AddItemToCategory: FC<AddItemToCategoryProps> = ({
  categoryId,
  isOpen,
  onClose,
  type,
  onAdd,
}) => {
  const { gray } = useModeColors();
  const toast = useToast();

  const onSuccess = () => {
    onAdd();
    toast({
      title: "Success",
      description: "The item has been added.",
      status: "success",
    });
    onClose();
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
                <ManualAddTab
                  categoryId={categoryId}
                  onClose={onClose}
                  onSuccess={onSuccess}
                />
              </TabPanel>
              <TabPanel>
                <SearchAddTab
                  categoryId={categoryId}
                  onSuccess={onSuccess}
                  type={type}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddItemToCategory;
