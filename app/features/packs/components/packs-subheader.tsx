import type { FC } from "react";

import { useState } from "react";
import { Link, Routes, useQuery, useRouter } from "blitz";

import { HStack, Heading } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/icon";
import { FcDoughnutChart, FcList, FcTimeline, FcRating } from "react-icons/fc";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import { Button } from "@chakra-ui/button";
import { FaChevronDown, FaEdit, FaShare, FaArrowRight } from "react-icons/fa";
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
import { MenuDivider } from "@chakra-ui/react";

import Subheader from "app/common/components/subheader";
import EditorHtml from "app/modules/editor/components/editor-html";
import useEditorHtml from "app/modules/editor/hooks/use-editor-html";

import packsQuery from "../queries/packs-query";

import PackForm from "./pack-form";
import PieChart from "./pie-chart";

const PacksSubheader: FC = () => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const [packs, { refetch }] = useQuery(packsQuery, {}, { suspense: false });

  const currentPackId = router.query.id as string;

  const currentPack = packs?.find((pack) => pack.id === currentPackId);

  const html = useEditorHtml(currentPack?.notes || "", {
    image: true,
    blockquote: true,
    heading: true,
    horizontalRule: true,
  });

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
          <DrawerHeader borderBottomWidth="1px">
            {currentPack?.name}
          </DrawerHeader>
          <DrawerBody>
            <PieChart />
            <EditorHtml
              fontSize="md"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Modal isOpen={editing} onClose={() => setEditing(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit {currentPack?.name}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <PackForm
              pack={currentPack}
              onSuccess={() => {
                setEditing(false);
                refetch();
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Subheader>
        <HStack justify="space-between">
          <Menu>
            <MenuButton
              as={Button}
              size="sm"
              variant="ghost"
              px={1}
              rightIcon={<Icon pr={1} as={FaChevronDown} />}
            >
              <HStack>
                <Icon as={FcTimeline} w={5} h={5} />
                <Heading size="sm" isTruncated>
                  {currentPack?.name}
                </Heading>
              </HStack>
            </MenuButton>

            <MenuList>
              <Link href={Routes.InventoryPage()} passHref>
                <MenuItem as="a" icon={<FcList />}>
                  Inventory
                </MenuItem>
              </Link>
              <Link href={Routes.WishListPage()} passHref>
                <MenuItem as="a" icon={<FcRating />}>
                  Wish list
                </MenuItem>
              </Link>
              {(packs?.length || 0) > 0 && <MenuDivider />}
              {packs?.map((pack) => (
                <Link
                  key={pack.id}
                  href={Routes.PackPage({ id: pack.id })}
                  passHref
                >
                  <MenuItem as="a" icon={<FcTimeline />}>
                    {pack.name}
                  </MenuItem>
                </Link>
              ))}
            </MenuList>
          </Menu>

          <HStack>
            <Menu>
              <MenuButton
                as={Button}
                size="sm"
                variant="ghost"
                rightIcon={<Icon pr={1} as={FaChevronDown} />}
              >
                Actions
              </MenuButton>

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
              Pack details
            </Button>
          </HStack>
        </HStack>
      </Subheader>
    </>
  );
};

export default PacksSubheader;
