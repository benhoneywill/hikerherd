import type { FC } from "react";
import type { GearCardContext } from "../contexts/gear-card-context";

import { Box, Wrap, Flex } from "@chakra-ui/layout";

import GearCardProvider from "../providers/gear-card-provider";

import GearCardHeader from "./gear-card-header";
import GearCardValues from "./gear-card-values";
import GearCardTags from "./gear-card-tags";

type GearCardProps = {
  menu?: JSX.Element | null;
  dragging?: boolean;
};

const GearCard: FC<GearCardContext & GearCardProps> = ({
  menu = null,
  dragging = false,
  children,
  ...props
}) => {
  return (
    <GearCardProvider {...props}>
      <Flex
        direction="column"
        borderRadius="md"
        position="relative"
        border="3px solid"
        borderColor={dragging ? "blue.400" : "gray"}
      >
        <GearCardHeader menu={menu} />

        <Wrap spacing={2} p={2} mx={1} mb={1} borderRadius="md" flexGrow={1}>
          <GearCardValues />
          <GearCardTags />
        </Wrap>

        {children && (
          <Box p={2} mt="auto">
            {children}
          </Box>
        )}
      </Flex>
    </GearCardProvider>
  );
};

export default GearCard;
