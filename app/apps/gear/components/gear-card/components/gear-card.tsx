import type { FC } from "react";
import type { Currency } from "db";

import { Box, Flex } from "@chakra-ui/layout";
import { useColorModeValue, useMediaQuery } from "@chakra-ui/react";

import GearCardHeader from "./gear-card-header";
import GearCardBody from "./gear-card-body";

type GearCardProps = {
  name: string;
  weight: number;
  imageUrl?: string | null;
  price?: number | null;
  currency?: Currency;
  worn?: boolean;
  consumable?: boolean;
  link?: string | null;
  notes?: string | null;
  quantity?: number;
  onHeadingClick?: () => void;
  menu?: JSX.Element | null;
  dragging?: boolean;
  compact?: boolean;
};

const GearCard: FC<GearCardProps> = ({
  name,
  imageUrl,
  onHeadingClick,
  weight,
  price,
  currency,
  quantity,
  worn,
  consumable,
  link,
  notes,
  menu = null,
  dragging = false,
  compact = false,
  children,
}) => {
  const bg = useColorModeValue("gray.50", "gray.800");
  const border = useColorModeValue("gray.100", "gray.900");

  const disableCompact = useMediaQuery("(max-width: 650px)")[0];

  const isCompact = compact && !disableCompact;

  return (
    <Flex
      direction="column"
      borderRadius="md"
      position="relative"
      border="2px solid"
      bg={bg}
      borderColor={dragging ? "blue.400" : border}
    >
      <GearCardHeader
        menu={menu}
        name={name}
        imageUrl={imageUrl}
        onHeadingClick={onHeadingClick}
        compact={compact}
        disableCompact={disableCompact}
        body={{
          weight,
          price,
          currency,
          quantity,
          worn,
          consumable,
          link,
          notes,
          compact: isCompact,
        }}
      />

      {!isCompact && (
        <GearCardBody
          weight={weight}
          price={price}
          currency={currency}
          quantity={quantity}
          worn={worn}
          consumable={consumable}
          link={link}
          notes={notes}
          compact={isCompact}
        />
      )}

      {children && (
        <Box p={2} pt={0} mt="auto">
          {children}
        </Box>
      )}
    </Flex>
  );
};

export default GearCard;
