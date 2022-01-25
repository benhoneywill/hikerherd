import type { FC } from "react";
import type { GearCardContext } from "../contexts/gear-card-context";

import { Box, Wrap, Flex } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/react";

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
  const bg = useColorModeValue("gray.50", "gray.800");
  const border = useColorModeValue("gray.100", "gray.900");
  const inner = useColorModeValue("white", "gray.700");

  return (
    <GearCardProvider {...props}>
      <Flex
        direction="column"
        borderRadius="md"
        position="relative"
        border="2px solid"
        bg={bg}
        borderColor={dragging ? "blue.400" : border}
      >
        <GearCardHeader menu={menu} />

        <Wrap
          spacing={2}
          p={2}
          m={2}
          borderRadius="md"
          border="1px solid"
          borderColor={border}
          flexGrow={1}
          bg={inner}
        >
          <GearCardValues />
          <GearCardTags />
        </Wrap>

        {children && (
          <Box p={2} pt={0} mt="auto">
            {children}
          </Box>
        )}
      </Flex>
    </GearCardProvider>
  );
};

export default GearCard;
