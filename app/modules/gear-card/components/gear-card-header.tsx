import type { FC } from "react";

import { useContext, Fragment } from "react";

import { Heading, HStack, Link } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { Icon } from "@chakra-ui/icon";
import { FaImage } from "react-icons/fa";
import { Menu, MenuButton } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { IconButton } from "@chakra-ui/button";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useColorModeValue } from "@chakra-ui/react";

import Popover from "app/modules/common/components/popover";

import gearCardContext from "../contexts/gear-card-context";

type GearCardHeaderProps = {
  menu?: JSX.Element | null;
};

const GearCardHeader: FC<GearCardHeaderProps> = ({ menu }) => {
  const { name, imageUrl, link } = useContext(gearCardContext);
  const avatarColor = useColorModeValue("gray.200", "gray.600");

  const HeadingWrapper: FC = link
    ? (props) => <Link href={link} {...props} isExternal isTruncated />
    : ({ children }) => <Fragment>{children}</Fragment>;

  return (
    <HStack justify="space-between" p={2} pb={0}>
      <HStack width={menu ? "calc(100% - 35px)" : "100%"}>
        <Popover
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
          <img src={imageUrl || ""} alt={name} />
        </Popover>

        <HeadingWrapper>
          <Heading size="xs" isTruncated>
            {name}
          </Heading>
        </HeadingWrapper>
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

export default GearCardHeader;
