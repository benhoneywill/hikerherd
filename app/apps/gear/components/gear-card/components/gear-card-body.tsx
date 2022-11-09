import type { FC } from "react";
import type { Currency } from "db";

import { Wrap } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/react";

import GearCardValues from "./gear-card-values";
import GearCardTags from "./gear-card-tags";

export type GearCardBodyProps = {
  weight: number;
  imageUrl?: string | null;
  price?: number | null;
  currency?: Currency;
  worn?: boolean;
  consumable?: boolean;
  link?: string | null;
  notes?: string | null;
  quantity?: number;
  compact?: boolean;
};

const GearCardBody: FC<GearCardBodyProps> = ({
  weight,
  price,
  currency,
  quantity,
  worn,
  consumable,
  link,
  notes,
  compact,
}) => {
  const border = useColorModeValue("gray.100", "gray.900");
  const inner = useColorModeValue("white", "gray.700");

  return (
    <Wrap
      spacing={2}
      p={compact ? 0 : 2}
      m={2}
      borderRadius="md"
      border="1px solid"
      borderColor={compact ? "transparent" : border}
      flexGrow={1}
      bg={compact ? "none" : inner}
      direction={compact ? "row-reverse" : "row"}
    >
      <GearCardValues
        weight={weight}
        price={price}
        currency={currency}
        quantity={quantity}
        compact={compact}
      />
      <GearCardTags
        worn={worn}
        consumable={consumable}
        link={link}
        notes={notes}
      />
    </Wrap>
  );
};

export default GearCardBody;
