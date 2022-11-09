import type { FC } from "react";
import type { GearCardBodyProps } from "./gear-card-body";

import { Heading, HStack } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/image";
import { Avatar } from "@chakra-ui/avatar";
import { Icon } from "@chakra-ui/icon";
import { FaImage } from "react-icons/fa";
import { Menu, MenuButton } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { IconButton } from "@chakra-ui/button";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useColorModeValue } from "@chakra-ui/react";

import Popover from "app/components/popover";

import GearCardBody from "./gear-card-body";

type GearCardHeaderProps = {
  menu?: JSX.Element | null;
  name: string;
  imageUrl?: string | null;
  onHeadingClick?: () => void;
  body: GearCardBodyProps;
  compact?: boolean;
  disableCompact?: boolean;
};

const GearCardHeader: FC<GearCardHeaderProps> = ({
  menu,
  name,
  imageUrl,
  onHeadingClick,
  body,
  compact,
  disableCompact,
}) => {
  const avatarColor = useColorModeValue("gray.200", "gray.600");

  const isCompact = compact && !disableCompact;

  return (
    <HStack
      justify="space-between"
      p={2}
      pb={isCompact ? 2 : 0}
      maxW={"940px"}
      w={compact ? "calc(100vw - 60px)" : undefined}
    >
      <HStack width={menu ? "calc(100% - 35px)" : "100%"} minW="150px">
        <Popover
          maxH="250px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          hideContent={!imageUrl}
          trigger={
            <Avatar
              src={imageUrl || ""}
              size="xs"
              icon={<Icon as={FaImage} />}
              bg={avatarColor}
            />
          }
        >
          <Image
            maxW="100%"
            maxH="230px"
            display="inline-block"
            src={imageUrl || ""}
            alt={name}
          />
        </Popover>

        <Heading
          size="xs"
          noOfLines={isCompact ? 1 : 2}
          cursor={onHeadingClick ? "pointer" : "inherit"}
          onClick={onHeadingClick}
        >
          {name}
        </Heading>
      </HStack>

      <HStack spacing={0} flexShrink={0}>
        {isCompact && <GearCardBody {...body} />}

        {menu && (
          <Menu isLazy>
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
    </HStack>
  );
};

export default GearCardHeader;
