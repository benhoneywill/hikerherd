import type { FC } from "react";

import { useContext } from "react";

import { Wrap } from "@chakra-ui/layout";
import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/tag";
import { FaTag, FaWeightHanging, FaClone } from "react-icons/fa";
import { Tooltip } from "@chakra-ui/tooltip";

import userPreferencesContext from "app/features/users/contexts/user-preferences-context";
import displayWeight from "app/modules/common/helpers/display-weight";
import displayCurrency from "app/modules/common/helpers/display-currency";

import gearCardContext from "../contexts/gear-card-context";

const GearCardValues: FC = () => {
  const { weightUnit } = useContext(userPreferencesContext);
  const { weight, price, currency, quantity } = useContext(gearCardContext);

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
};

export default GearCardValues;
