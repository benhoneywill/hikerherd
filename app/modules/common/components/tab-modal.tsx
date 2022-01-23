import type { FC } from "react";
import type { IconType } from "react-icons";

import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/modal";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/tabs";
import { Icon } from "@chakra-ui/icon";
import { HStack, Text } from "@chakra-ui/layout";

type TabModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tabs: Array<{ title: string; icon: IconType; content: JSX.Element }>;
};

const TabModal: FC<TabModalProps> = ({ isOpen, onClose, tabs }) => {
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
              borderTopLeftRadius="md"
              borderTopRightRadius="md"
              overflowX="auto"
              overflowY="hidden"
            >
              {tabs.map((tab) => (
                <Tab py={4} flexShrink={0} key={tab.title}>
                  <HStack>
                    <Icon as={tab.icon} />
                    <Text whiteSpace="nowrap" overflow="hidden">
                      {tab.title}
                    </Text>
                  </HStack>
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {tabs.map((tab) => (
                <TabPanel key={tab.title}>{tab.content}</TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TabModal;
