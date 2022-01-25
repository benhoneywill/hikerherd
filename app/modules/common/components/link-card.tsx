import type { RouteUrlObject } from "blitz";
import type { FC } from "react";
import type { IconType } from "react-icons";

import { Link } from "blitz";

import { Stack, Heading, Text } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/icon";

import Card from "./card";

type LinkCardProps = {
  href: RouteUrlObject;
  icon: IconType;
  title: string;
  text?: string;
};

const LinkCard: FC<LinkCardProps> = ({ href, title, text, icon }) => {
  return (
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
  );
};

export default LinkCard;
