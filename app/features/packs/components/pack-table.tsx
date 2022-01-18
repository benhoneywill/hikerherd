import type { FC } from "react";
import type { PackResult } from "../queries/pack-query";

import { Button, IconButton, Stack } from "@chakra-ui/react";
import { Box } from "@chakra-ui/layout";
import { Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/table";
import { FaFlagUsa, FaGlobeEurope, FaInfo } from "react-icons/fa";

import Popover from "app/common/components/popover";
import displayWeight from "app/common/helpers/display-weight";
import useUserPreferences from "app/features/users/hooks/use-user-preferences";
import useModeColors from "app/common/hooks/use-mode-colors";

import useCalculateTotals from "../hooks/use-calculate-totals";

type PackTableProps = {
  categories: Array<PackResult["categories"][number] & { weight: number }>;
  colors: string[];
};

type TotalRowProps = {
  description: string;
  name: string;
  value: number;
};

const TotalRow: FC<TotalRowProps> = ({ description, name, value }) => {
  const { weightUnit } = useUserPreferences();

  return (
    <Tr fontWeight="bold">
      <Td border="none">
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
      <Td border="none">{name}</Td>
      <Td border="none" isNumeric>
        {displayWeight(value, weightUnit, true)}
      </Td>
    </Tr>
  );
};

const PackTable: FC<PackTableProps> = ({ categories, colors }) => {
  const { total, packWeight, baseWeight } = useCalculateTotals(categories);
  const { weightUnit, toggleWeightUnits } = useUserPreferences();
  const { gray } = useModeColors();

  return (
    <Stack w="100%" align="flex-end">
      <Stack
        alignSelf="stretch"
        bg={gray[100]}
        border="1px solid"
        borderColor={gray[200]}
        borderRadius="md"
        p={3}
      >
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th w="40px" border="none"></Th>
              <Th border="none">Category</Th>
              <Th border="none" isNumeric>
                Weight
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {categories.map((category, index) => (
              <Tr key={category.id}>
                <Td border="none">
                  <Box
                    bg={colors[index % colors.length]}
                    w={3}
                    h={3}
                    borderRadius="full"
                  />
                </Td>
                <Td border="none">{category.name}</Td>
                <Td border="none" isNumeric>
                  {displayWeight(category.weight, weightUnit, true)}
                </Td>
              </Tr>
            ))}

            <TotalRow
              description="Total weight is the weight of everything, including your worn items and your consumables."
              name="Total"
              value={total}
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
