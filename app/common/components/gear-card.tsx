import type { FC } from "react";
import type { Currency, GearType } from "db";

import { Box, Heading, HStack, Link, Wrap, Flex } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/tag";
import { Icon } from "@chakra-ui/icon";
import {
  FaTag,
  FaLink,
  FaRegStickyNote,
  FaTshirt,
  FaHamburger,
  FaWeightHanging,
  FaImage,
  FaClone,
} from "react-icons/fa";
import { Tooltip } from "@chakra-ui/tooltip";
import { Menu, MenuButton } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { IconButton } from "@chakra-ui/button";
import { BsThreeDotsVertical } from "react-icons/bs";

import useUserPreferences from "app/features/users/hooks/use-user-preferences";

import useModeColors from "../hooks/use-mode-colors";
import displayWeight from "../helpers/display-weight";
import displayCurrency from "../helpers/display-currency";
import gearTypeIcon from "../helpers/gear-type-icon";

import Popover from "./popover";

type GearCardProps = {
  name: string;
  weight: number;
  imageUrl?: string | null;
  price?: number | null;
  currency?: Currency;
  worn?: boolean;
  consumable?: boolean;
  link?: string | null;
  notes?: string | null;
  menu?: JSX.Element | null;
  dragging?: boolean;
  quantity?: number;
  type?: GearType | null;
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

const GearCardValues: FC<
  Pick<GearCardProps, "weight" | "price" | "quantity" | "currency">
> = ({ weight, price, currency, quantity }) => {
  const { weightUnit } = useUserPreferences();

  return (
    <Wrap>
      <Tooltip label="weight">
        <Tag colorScheme="teal" size="sm">
          <TagLeftIcon as={FaWeightHanging} />
          <TagLabel>{displayWeight(weight, weightUnit)}</TagLabel>
        </Tag>
      </Tooltip>
      {Number.isInteger(price) && (
        <Tooltip label="price">
          <Tag colorScheme="purple" size="sm">
            <TagLeftIcon as={FaTag} />
            <TagLabel>
              {displayCurrency(currency)}
              {Number(price) / 100}
            </TagLabel>
          </Tag>
        </Tooltip>
      )}
      {quantity !== 1 && (
        <Tooltip label="quantity">
          <Tag colorScheme="orange" size="sm">
            <TagLeftIcon as={FaClone} />
            <TagLabel>{quantity}</TagLabel>
          </Tag>
        </Tooltip>
      )}
    </Wrap>
  );
};

const GearCardTags: FC<
  Pick<GearCardProps, "link" | "worn" | "consumable" | "notes" | "type">
> = ({ link, worn, consumable, notes, type }) => {
  const { gray } = useModeColors();

  return (
    <Wrap>
      {type && (
        <Tooltip label={type.toLowerCase()}>
          <Tag size="sm" bg={gray[200]} borderRadius="full">
            <Icon as={gearTypeIcon(type)} />
          </Tag>
        </Tooltip>
      )}

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
            <Icon as={FaHamburger} />
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
    </Wrap>
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
  quantity = 1,
  currency,
  type,
  children,
}) => {
  const { gray } = useModeColors();
  const hasTags = worn || consumable || link || notes || type;

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
        <GearCardValues
          weight={weight}
          price={price}
          quantity={quantity}
          currency={currency}
        />

        {hasTags && (
          <GearCardTags
            worn={worn}
            link={link}
            consumable={consumable}
            notes={notes}
            type={type}
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
