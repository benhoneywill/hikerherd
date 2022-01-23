import type { FC } from "react";

import { useContext } from "react";

import { Heading, HStack } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { Icon } from "@chakra-ui/icon";
import { FaImage } from "react-icons/fa";
import { Menu, MenuButton } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { IconButton } from "@chakra-ui/button";
import { BsThreeDotsVertical } from "react-icons/bs";

import Popover from "app/modules/common/components/popover";

import gearCardContext from "../contexts/gear-card-context";

type GearCardHeaderProps = {
  menu?: JSX.Element | null;
};

const GearCardHeader: FC<GearCardHeaderProps> = ({ menu }) => {
  const { name, imageUrl } = useContext(gearCardContext);

  return (
    <HStack justify="space-between" p={2}>
      <HStack width={menu ? "calc(100% - 35px)" : "100%"}>
        <Popover
          hideContent={!imageUrl}
          trigger={
            <Avatar
              src={imageUrl || ""}
              size="xs"
              icon={<Icon as={FaImage} />}
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

export default GearCardHeader;
