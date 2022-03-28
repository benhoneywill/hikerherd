import type { RouteUrlObject } from "blitz";
import type { FC } from "react";
import type { IconType } from "react-icons";

import { Link } from "blitz";

import { Heading, Text, LinkOverlay, Stack } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/icon";

import LinkCard from "app/components/link-card";

type IndexCardProps = {
  href: RouteUrlObject | string;
  icon: IconType;
  title: string;
  text: string;
};

const IndexCard: FC<IndexCardProps> = ({ href, icon, title, text }) => {
  return (
    <LinkCard>
      <Stack align="center" textAlign="center">
        <Icon mt={1} as={icon} w={8} h={8} />
        <Link href={href} passHref>
          <LinkOverlay>
            <Heading size="md">{title}</Heading>
          </LinkOverlay>
        </Link>
        <Text opacity="0.6">{text}</Text>
      </Stack>
    </LinkCard>
  );
};

export default IndexCard;
