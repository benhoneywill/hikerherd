import type { FC } from "react";
import type { CategoryType } from "db";

import { useMemo, useState } from "react";
import { useQuery } from "blitz";

import Fuse from "fuse.js";
import {
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

import inventoryItemsQuery from "app/features/inventory/queries/inventory-items-query";
import GearCard from "app/common/components/gear-card";

type PackAddInventoryItemProps = {
  type: CategoryType;
  addToPack: (gearId: string) => void;
};

const PackAddInventoryItem: FC<PackAddInventoryItemProps> = ({
  type,
  addToPack,
}) => {
  const [query, setQuery] = useState("");

  const [items] = useQuery(inventoryItemsQuery, { type }, { suspense: false });

  const filteredItems = useMemo(() => {
    if (!items) return [];

    if (!query) {
      return items.map((item) => ({
        item,
        matches: [],
        score: 1,
      }));
    }

    const fuse = new Fuse(items, {
      keys: ["gear.name", "gear.notes"],
    });

    return fuse.search(query);
  }, [items, query]);

  return (
    <Stack spacing={3}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={FaSearch} />
        </InputLeftElement>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your gear..."
        />
      </InputGroup>

      <SimpleGrid columns={2} spacing={3}>
        {filteredItems.map(({ item }) => (
          <GearCard
            key={item.id}
            name={item.gear.name}
            weight={item.gear.weight}
            price={item.gear.price}
            consumable={item.gear.consumable}
            link={item.gear.link}
            notes={item.gear.notes}
          >
            <Button
              size="sm"
              colorScheme="green"
              isFullWidth
              onClick={() => addToPack(item.gear.id)}
            >
              Add to pack
            </Button>
          </GearCard>
        ))}
      </SimpleGrid>
    </Stack>
  );
};

export default PackAddInventoryItem;
