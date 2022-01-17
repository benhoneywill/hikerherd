import type { FC } from "react";

import { useState } from "react";
import { Link, Routes, useQuery, useRouter } from "blitz";

import { HStack } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/icon";
import { FcDoughnutChart } from "react-icons/fc";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import { Button, IconButton } from "@chakra-ui/button";
import {
  FaChevronDown,
  FaEdit,
  FaShare,
  FaArrowRight,
  FaCog,
} from "react-icons/fa";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
} from "@chakra-ui/modal";

import packQuery from "../queries/pack-query";

import PackForm from "./pack-form";
import PackAnalytics from "./pack-analytics";

const PacksSubheader: FC = () => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const [pack, { refetch }] = useQuery(
    packQuery,
    { id: router.query.packId as string },
    { suspense: false }
  );

  return (
    <>
      <Drawer
        placement="right"
        size="xl"
        onClose={() => setShowStats(false)}
        isOpen={showStats}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton onClose={() => setShowStats(false)} zIndex={2} />
          <DrawerHeader borderBottomWidth="1px">{pack?.name}</DrawerHeader>
          <DrawerBody p={0}>{pack && <PackAnalytics pack={pack} />}</DrawerBody>
        </DrawerContent>
      </Drawer>

      <Modal isOpen={editing} onClose={() => setEditing(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit {pack?.name}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <PackForm
              pack={pack}
              onSuccess={() => {
                setEditing(false);
                refetch();
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <HStack>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="actions"
            size="sm"
            variant="outline"
            px={2}
            rightIcon={<Icon as={FaChevronDown} pr={1} mr={1} />}
            icon={
              <Icon as={FaCog} color="gray.500" w={5} h={5} pl={1} ml={1} />
            }
          />

          <MenuList>
            <MenuItem icon={<FaEdit />} onClick={() => setEditing(true)}>
              Edit
            </MenuItem>
            <Link href={Routes.HomePage()} passHref>
              <MenuItem as="a" icon={<FaShare />}>
                Share
              </MenuItem>
            </Link>
          </MenuList>
        </Menu>

        <Button
          size="sm"
          leftIcon={<Icon w={6} h={6} as={FcDoughnutChart} />}
          rightIcon={<Icon w={3} h={3} as={FaArrowRight} />}
          color="blue.500"
          fontWeight="bold"
          colorScheme="blue"
          variant="outline"
          pl={2}
          onClick={() => setShowStats(true)}
        >
          Analytics
        </Button>
      </HStack>
    </>
  );
};

export default PacksSubheader;
