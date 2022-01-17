import type { FC } from "react";
import type { PackResult } from "../queries/pack-query";

import { IconButton } from "@chakra-ui/react";
import { Box } from "@chakra-ui/layout";
import { Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/table";
import { FaInfo } from "react-icons/fa";

import Popover from "app/common/components/popover";

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
      <Td isNumeric>{value}</Td>
    </Tr>
  );
};

const PackTable: FC<PackTableProps> = ({ categories, colors }) => {
  const { total, packWeight, baseWeight } = useCalculateTotals(categories);

  return (
    <Table variant="simple" size="sm">
      <Thead>
        <Tr>
          <Th></Th>
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
            <Td isNumeric>{category.weight}</Td>
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
  );
};

export default PackTable;
