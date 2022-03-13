import type { RouteUrlObject } from "blitz";
import type { FC } from "react";
import type { BoxProps } from "@chakra-ui/layout";

import { Link } from "blitz";

import { HStack, Box } from "@chakra-ui/layout";

import Card from "./card";

type LinkCardProps = BoxProps & {
  href: RouteUrlObject;
  actions?: JSX.Element;
};

const LinkCard: FC<LinkCardProps> = ({ href, children, actions, ...props }) => {
  return (
    <Box position="relative" h="100%">
      {actions && (
        <HStack
          position="absolute"
          top={3}
          right={3}
          opacity="0.5"
          _hover={{ opacity: 1 }}
        >
          {actions}
        </HStack>
      )}

      <Link href={href} passHref>
        <a>
          <Card
            transition="border 50ms ease"
            _hover={{ borderColor: "blue.400" }}
            {...props}
          >
            {children}
          </Card>
        </a>
      </Link>
    </Box>
  );
};

export default LinkCard;
