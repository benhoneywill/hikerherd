import type { FC } from "react";
import type { Currency } from "db";

import { memo, useContext } from "react";

import { Wrap } from "@chakra-ui/layout";
import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/tag";
import { FaTag, FaWeightHanging, FaClone } from "react-icons/fa";
import { Tooltip } from "@chakra-ui/tooltip";

import userPreferencesContext from "app/apps/users/contexts/user-preferences-context";
import displayWeight from "app/helpers/display-weight";
import displayCurrency from "app/helpers/display-currency";

type GearCardValuesProps = {
  weight: number;
  price?: number | null;
  currency?: Currency;
  quantity?: number;
};

const GearCardValues: FC<GearCardValuesProps> = memo(
  ({ weight, price, currency, quantity }) => {
    const { weightUnit } = useContext(userPreferencesContext);

    return (
      <Wrap>
        <Tooltip label="weight">
          <Tag colorScheme="teal" size="sm">
            <TagLeftIcon as={FaWeightHanging} />
            <TagLabel>{displayWeight(weight, weightUnit)}</TagLabel>
          </Tag>
        </Tooltip>

        {Number.isInteger(price) && (
          <Tooltip label="price">
            <Tag colorScheme="purple" size="sm">
              <TagLeftIcon as={FaTag} />
              <TagLabel>
                {displayCurrency(currency)}
                {Number(price) / 100}
              </TagLabel>
            </Tag>
          </Tooltip>
        )}

        {(quantity === 0 || (quantity && quantity > 1)) && (
          <Tooltip label="quantity">
            <Tag colorScheme="orange" size="sm">
              <TagLeftIcon as={FaClone} />
              <TagLabel>{quantity}</TagLabel>
            </Tag>
          </Tooltip>
        )}
      </Wrap>
    );
  }
);

export default GearCardValues;
