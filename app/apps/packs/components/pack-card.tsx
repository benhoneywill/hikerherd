import type { FC } from "react";
import type { Pack } from "db";
import type { BoxProps } from "@chakra-ui/layout";

import { useContext } from "react";
import { Link, Routes } from "blitz";

import { Heading, HStack, Stack, LinkOverlay } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/icon";
import { FcLock } from "react-icons/fc";
import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/tag";
import { FaHamburger, FaTshirt, FaWeightHanging } from "react-icons/fa";

import displayWeight from "app/helpers/display-weight";
import LinkCard from "app/components/link-card";
import userPreferencesContext from "app/apps/users/contexts/user-preferences-context";
import UserTag from "app/components/user-tag";

type PackTotals = {
  consumableWeight: number;
  wornWeight: number;
  baseWeight: number;
};

type PackCardProps = {
  pack: Pick<Pack, "id" | "name" | "private"> & { totals: PackTotals };
  user?: {
    username: string;
    avatar_id: string | null;
    avatar_version: number | null;
  };
  actions?: JSX.Element;
  shareLink?: boolean;
};

const PackCard: FC<PackCardProps & BoxProps> = ({
  pack,
  actions,
  shareLink,
  user,
  ...props
}) => {
  const { weightUnit } = useContext(userPreferencesContext);

  const route = shareLink ? Routes.PackSharePage : Routes.PackPage;

  return (
    <LinkCard actions={actions} {...props}>
      <Stack align="center" spacing={5}>
        <Stack maxW="100%" px={8} align="center" spacing={2}>
          <HStack maxW="100%">
            {pack.private && <Icon as={FcLock} h={4} w={4} />}

            <Link href={route({ packId: pack.id })} passHref>
              <LinkOverlay isTruncated>
                <Heading size="md" isTruncated>
                  {pack.name}
                </Heading>
              </LinkOverlay>
            </Link>
          </HStack>

          {user && <UserTag size="sm" user={user} />}
        </Stack>

        <HStack>
          <Tag colorScheme="pink" size="sm">
            <TagLeftIcon as={FaHamburger} />
            <TagLabel>
              {displayWeight(pack.totals.consumableWeight, weightUnit, true)}
            </TagLabel>
          </Tag>
          <Tag colorScheme="blue" size="sm">
            <TagLeftIcon as={FaTshirt} />
            <TagLabel>
              {displayWeight(pack.totals.wornWeight, weightUnit, true)}
            </TagLabel>
          </Tag>
          <Tag colorScheme="teal" size="sm">
            <TagLeftIcon as={FaWeightHanging} />
            <TagLabel>
              {displayWeight(pack.totals.baseWeight, weightUnit, true)}
            </TagLabel>
          </Tag>
        </HStack>
      </Stack>
    </LinkCard>
  );
};

export default PackCard;
