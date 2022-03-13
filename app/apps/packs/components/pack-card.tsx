import type { FC } from "react";
import type { Pack } from "db";

import { useContext } from "react";
import { Routes } from "blitz";

import { Heading, HStack, Stack } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/icon";
import { FcTimeline, FcLock } from "react-icons/fc";
import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/tag";
import { FaFeather, FaWeightHanging } from "react-icons/fa";
import { Tooltip } from "@chakra-ui/tooltip";
import { BsBagFill } from "react-icons/bs";

import displayWeight from "app/helpers/display-weight";
import LinkCard from "app/components/link-card";
import userPreferencesContext from "app/apps/users/contexts/user-preferences-context";

type PackTotals = {
  totalWeight: number;
  packWeight: number;
  baseWeight: number;
};

type PackCardProps = {
  pack: Pick<Pack, "id" | "name" | "private"> & { totals: PackTotals };
  actions?: JSX.Element;
  shareLink?: boolean;
};

const PackCard: FC<PackCardProps> = ({ pack, actions, shareLink }) => {
  const { weightUnit } = useContext(userPreferencesContext);

  const route = shareLink ? Routes.PackSharePage : Routes.PackPage;

  return (
    <LinkCard actions={actions} href={route({ packId: pack.id })}>
      <Stack align="center" spacing={4}>
        <HStack maxW="100%" px={8}>
          <Icon as={pack.private ? FcLock : FcTimeline} h={4} w={4} />
          <Heading size="sm" isTruncated>
            {pack.name}
          </Heading>
        </HStack>

        <HStack>
          <Tooltip label="Total weight">
            <Tag colorScheme="purple" size="sm">
              <TagLeftIcon as={FaWeightHanging} />
              <TagLabel>
                {displayWeight(pack.totals.totalWeight, weightUnit, true)}
              </TagLabel>
            </Tag>
          </Tooltip>
          <Tooltip label="Pack weight">
            <Tag colorScheme="blue" size="sm">
              <TagLeftIcon as={BsBagFill} />
              <TagLabel>
                {displayWeight(pack.totals.packWeight, weightUnit, true)}
              </TagLabel>
            </Tag>
          </Tooltip>
          <Tooltip label="Base weight">
            <Tag colorScheme="teal" size="sm">
              <TagLeftIcon as={FaFeather} />
              <TagLabel>
                {displayWeight(pack.totals.baseWeight, weightUnit, true)}
              </TagLabel>
            </Tag>
          </Tooltip>
        </HStack>
      </Stack>
    </LinkCard>
  );
};

export default PackCard;
