import type { FC } from "react";

import { Box, Heading, HStack, Link, Stack, Flex } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/tag";
import { Icon } from "@chakra-ui/icon";
import {
  FaTag,
  FaLink,
  FaRegStickyNote,
  FaTshirt,
  FaUtensilSpoon,
  FaWeightHanging,
  FaImage,
} from "react-icons/fa";
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
} from "@chakra-ui/popover";
import { Tooltip } from "@chakra-ui/tooltip";
import { Menu, MenuButton, IconButton, Portal } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";

type GearCardProps = {
  name: string;
  weight: number;
  imageUrl?: string | null;
  price?: number | null;
  worn?: boolean;
  consumable?: boolean;
  link?: string | null;
  notes?: string | null;
  menu?: JSX.Element;
  dragging?: boolean;
};

const GearCard: FC<GearCardProps> = ({
  imageUrl,
  name,
  weight,
  price,
  worn = false,
  consumable = false,
  link,
  notes,
  menu = null,
  dragging = false,
  children,
}) => {
  const hasBar = worn || consumable || link || notes;

  return (
    <Flex
      direction="column"
      borderRadius="md"
      bg="gray.200"
      position="relative"
      border="3px solid"
      borderColor={dragging ? "blue.400" : "gray.200"}
    >
      <HStack justify="space-between" p={2}>
        <HStack width={menu ? "calc(100% - 35px)" : "100%"}>
          <Popover trigger="hover">
            <PopoverTrigger>
              <Avatar
                src={imageUrl || ""}
                size="xs"
                icon={<FaImage />}
                bg="gray.100"
                cursor={imageUrl ? "zoom-in" : "default"}
              />
            </PopoverTrigger>
            {imageUrl && (
              <Portal>
                <PopoverContent zIndex={5} w="200px">
                  <PopoverArrow />
                  <PopoverBody>
                    <img src={imageUrl} alt={name} />
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            )}
          </Popover>
          <Heading size="xs" isTruncated>
            {name}
          </Heading>
        </HStack>

        {menu && (
          <Menu>
            <MenuButton
              as={IconButton}
              borderRadius="full"
              icon={<BsThreeDotsVertical />}
              size="xs"
              aria-label="actions"
            />
            <Portal>{menu}</Portal>
          </Menu>
        )}
      </HStack>

      <Stack
        spacing={3}
        p={2}
        bg="gray.100"
        mx={1}
        mb={1}
        borderRadius="md"
        flexGrow={1}
      >
        <HStack>
          <Tag colorScheme="teal" size="sm">
            <TagLeftIcon as={FaWeightHanging} />
            <TagLabel>{weight}g</TagLabel>
          </Tag>
          {price && (
            <Tag colorScheme="purple" size="sm">
              <TagLeftIcon as={FaTag} />
              <TagLabel>£{price / 100}</TagLabel>
            </Tag>
          )}
        </HStack>

        {hasBar && (
          <HStack>
            {link && (
              <Tooltip label="link">
                <Link href={link} isExternal display="inline-flex">
                  <Tag size="sm" borderRadius="full" bg="gray.50">
                    <Icon as={FaLink} />
                  </Tag>
                </Link>
              </Tooltip>
            )}
            {worn && (
              <Tooltip label="worn">
                <Tag
                  colorScheme="blue"
                  size="sm"
                  borderRadius="full"
                  cursor="default"
                >
                  <Icon as={FaTshirt} />
                </Tag>
              </Tooltip>
            )}
            {consumable && (
              <Tooltip label="consumable">
                <Tag
                  colorScheme="pink"
                  size="sm"
                  borderRadius="full"
                  cursor="default"
                >
                  <Icon as={FaUtensilSpoon} />
                </Tag>
              </Tooltip>
            )}
            {notes && (
              <Popover trigger="hover">
                <PopoverTrigger>
                  <Tag
                    colorScheme="yellow"
                    size="sm"
                    borderRadius="full"
                    cursor="help"
                  >
                    <Icon as={FaRegStickyNote} />
                  </Tag>
                </PopoverTrigger>
                <Portal>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverBody>{notes}</PopoverBody>
                  </PopoverContent>
                </Portal>
              </Popover>
            )}
          </HStack>
        )}
      </Stack>

      {children && (
        <Box p={2} mt="auto">
          {children}
        </Box>
      )}
    </Flex>
  );
};

export default GearCard;
