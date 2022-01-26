import type { RouteUrlObject } from "blitz";
import type { FC } from "react";
import type { IconType } from "react-icons";

import { Link } from "blitz";

import { Stack, Heading, Text, HStack, Box } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/icon";

import Card from "./card";

type LinkCardProps = {
  href: RouteUrlObject;
  icon: IconType;
  title: string;
  text?: string;
  actions?: JSX.Element;
};

const LinkCard: FC<LinkCardProps> = ({ href, title, text, icon, actions }) => {
  return (
    <Box position="relative">
      {actions && (
        <HStack position="absolute" top={3} right={3}>
          {actions}
        </HStack>
      )}
      <Link href={href} passHref>
        <Card
          as="a"
          transition="border 50ms ease"
          _hover={{ borderColor: "blue.400" }}
        >
          <Stack align="center" textAlign="center">
            <Icon mt={1} as={icon} w={8} h={8} />
            <Heading size="md">{title}</Heading>
            {text && <Text opacity="0.6">{text}</Text>}
          </Stack>
        </Card>
      </Link>
    </Box>
  );
};

export default LinkCard;
