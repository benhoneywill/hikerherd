import type { RouteUrlObject } from "blitz";
import type { FC } from "react";
import type { IconType } from "react-icons";

import { Link } from "blitz";

import { Stack, Heading, Text } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/icon";

type LinkCardProps = {
  href: RouteUrlObject;
  icon: IconType;
  title: string;
  text?: string;
};

const LinkCard: FC<LinkCardProps> = ({ href, title, text, icon }) => {
  return (
    <Link href={href} passHref>
      <Stack
        as="a"
        boxShadow="sm"
        py={6}
        px={4}
        borderRadius="md"
        align="center"
        textAlign="center"
        border="1px solid"
        transition="border 50ms ease"
        _hover={{ borderColor: "blue.400" }}
      >
        <Icon mt={1} as={icon} w={8} h={8} />
        <Heading size="md">{title}</Heading>
        {text && <Text opacity="0.6">{text}</Text>}
      </Stack>
    </Link>
  );
};

export default LinkCard;
