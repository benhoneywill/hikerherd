import type { FC } from "react";

import { useContext } from "react";

import { Button, IconButton, Stack } from "@chakra-ui/react";
import { Box } from "@chakra-ui/layout";
import { Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/table";
import { FaFlagUsa, FaGlobeEurope, FaInfo } from "react-icons/fa";

import userPreferencesContext from "app/features/users/contexts/user-preferences-context";
import Popover from "app/modules/common/components/popover";
import displayWeight from "app/modules/common/helpers/display-weight";

import packContext from "../contexts/pack-context";

type TotalRowProps = {
  description: string;
  name: string;
  value: number;
};

const TotalRow: FC<TotalRowProps> = ({ description, name, value }) => {
  const { weightUnit } = useContext(userPreferencesContext);

  return (
    <Tr fontWeight="bold">
      <Td>
        <Popover
          trigger={
            <IconButton
              size="sm"
              minW={3}
              h={3}
              variant="ghost"
              aria-label="What is this?"
              icon={<FaInfo />}
              color="gray.400"
            />
          }
        >
          {description}
        </Popover>
      </Td>
      <Td>{name}</Td>
      <Td isNumeric>{displayWeight(value, weightUnit, true)}</Td>
    </Tr>
  );
};

type PackTableProps = {
  colors: string[];
};

const PackTable: FC<PackTableProps> = ({ colors }) => {
  const { categories, totalWeight, packWeight, baseWeight } =
    useContext(packContext);
  const { weightUnit, toggleWeightUnits } = useContext(userPreferencesContext);

  return (
    <Stack w="100%" align="flex-end" spacing={6}>
      <Stack alignSelf="stretch">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th w="40px"></Th>
              <Th>Category</Th>
              <Th isNumeric>Weight</Th>
            </Tr>
          </Thead>

          <Tbody>
            {categories.map((category, index) => (
              <Tr key={category.id}>
                <Td>
                  <Box
                    bg={colors[index % colors.length]}
                    w={3}
                    h={3}
                    borderRadius="full"
                  />
                </Td>
                <Td>{category.name}</Td>
                <Td isNumeric>
                  {displayWeight(category.weight, weightUnit, true)}
                </Td>
              </Tr>
            ))}

            <TotalRow
              description="Total weight is the weight of everything, including your worn items and your consumables."
              name="Total weight"
              value={totalWeight}
            />

            <TotalRow
              description="Pack weight is the weight of your loaded pack including consumables. Worn items are not included."
              name="Pack weight"
              value={packWeight}
            />

            <TotalRow
              description="Base weight is the weight of your loaded pack minus the weight of any consumables."
              name="Base weight"
              value={baseWeight}
            />
          </Tbody>
        </Table>
      </Stack>

      <Button
        size="xs"
        onClick={toggleWeightUnits}
        leftIcon={weightUnit === "METRIC" ? <FaFlagUsa /> : <FaGlobeEurope />}
      >
        {weightUnit === "IMPERIAL" ? "Use metric units" : "Use imperial units"}
      </Button>
    </Stack>
  );
};

export default PackTable;
