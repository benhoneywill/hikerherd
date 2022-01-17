import type { FC } from "react";

import { Box, Heading, HStack, Link, Wrap, Flex } from "@chakra-ui/layout";
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
import { Tooltip } from "@chakra-ui/tooltip";
import { Menu, MenuButton } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { IconButton } from "@chakra-ui/button";
import { BsThreeDotsVertical } from "react-icons/bs";

import useModeColors from "../hooks/use-mode-colors";

import Popover from "./popover";

type GearCardProps = {
  name: string;
  weight: number;
  imageUrl?: string | null;
  price?: number | null;
  worn?: boolean;
  consumable?: boolean;
  link?: string | null;
  notes?: string | null;
  menu?: JSX.Element | null;
  dragging?: boolean;
};

const GearCardHeader: FC<Pick<GearCardProps, "menu" | "name" | "imageUrl">> = ({
  menu,
  name,
  imageUrl,
}) => {
  const { gray } = useModeColors();

  return (
    <HStack justify="space-between" p={2}>
      <HStack width={menu ? "calc(100% - 35px)" : "100%"}>
        <Popover
          hideContent={!imageUrl}
          trigger={
            <Avatar
              src={imageUrl || ""}
              size="xs"
              icon={<Icon as={FaImage} color={gray[300]} />}
              bg={gray[100]}
            />
          }
        >
          <img src={imageUrl || ""} alt={name} />
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
  );
};

const GearCardValues: FC<Pick<GearCardProps, "weight" | "price">> = ({
  weight,
  price,
}) => {
  return (
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
  );
};

const GearCardTags: FC<
  Pick<GearCardProps, "link" | "worn" | "consumable" | "notes">
> = ({ link, worn, consumable, notes }) => {
  const { gray } = useModeColors();

  return (
    <HStack>
      {link && (
        <Tooltip label="link">
          <Link href={link} isExternal display="inline-flex">
            <Tag size="sm" borderRadius="full" bg={gray[50]}>
              <Icon as={FaLink} />
            </Tag>
          </Link>
        </Tooltip>
      )}

      {worn && (
        <Tooltip label="worn">
          <Tag colorScheme="blue" size="sm" borderRadius="full">
            <Icon as={FaTshirt} />
          </Tag>
        </Tooltip>
      )}

      {consumable && (
        <Tooltip label="consumable">
          <Tag colorScheme="pink" size="sm" borderRadius="full">
            <Icon as={FaUtensilSpoon} />
          </Tag>
        </Tooltip>
      )}

      {notes && (
        <Popover
          trigger={
            <Tag colorScheme="yellow" size="sm" borderRadius="full">
              <Icon as={FaRegStickyNote} />
            </Tag>
          }
        >
          {notes}
        </Popover>
      )}
    </HStack>
  );
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
  const { gray } = useModeColors();
  const hasTags = worn || consumable || link || notes;

  return (
    <Flex
      direction="column"
      borderRadius="md"
      bg={gray[200]}
      position="relative"
      border="3px solid"
      borderColor={dragging ? "blue.400" : gray[200]}
    >
      <GearCardHeader name={name} imageUrl={imageUrl} menu={menu} />

      <Wrap
        spacing={2}
        p={2}
        bg={gray[100]}
        mx={1}
        mb={1}
        borderRadius="md"
        flexGrow={1}
      >
        <GearCardValues weight={weight} price={price} />

        {hasTags && (
          <GearCardTags
            worn={worn}
            link={link}
            consumable={consumable}
            notes={notes}
          />
        )}
      </Wrap>

      {children && (
        <Box p={2} mt="auto">
          {children}
        </Box>
      )}
    </Flex>
  );
};

export default GearCard;
