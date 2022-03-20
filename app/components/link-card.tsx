import type { FC } from "react";
import type { BoxProps } from "@chakra-ui/layout";

import { HStack, LinkBox } from "@chakra-ui/layout";

import Card from "./card";

type LinkCardProps = BoxProps & {
  actions?: JSX.Element;
};

const LinkCard: FC<LinkCardProps> = ({ children, actions, ...props }) => {
  return (
    <LinkBox
      as={Card}
      position="relative"
      h="100%"
      transition="border 50ms ease"
      _hover={{ borderColor: "blue.400" }}
      {...props}
    >
      {actions && (
        <HStack
          position="absolute"
          top={3}
          right={3}
          opacity="0.5"
          zIndex={2}
          _hover={{ opacity: 1 }}
        >
          {actions}
        </HStack>
      )}

      {children}
    </LinkBox>
  );
};

export default LinkCard;
