import type { FC } from "react";
import type { CategoryType } from "db";

import { useMemo, useState } from "react";
import { useQuery } from "blitz";

import Fuse from "fuse.js";
import { Button, Center, SimpleGrid, Spinner, Stack } from "@chakra-ui/react";

import inventoryItemsQuery from "app/features/inventory/queries/inventory-items-query";
import GearCard from "app/common/components/gear-card";
import SearchInput from "app/common/components/search-input";

type PackAddInventoryItemProps = {
  type: CategoryType;
  addToPack: (gearId: string) => Promise<void>;
};

const PackAddInventoryItem: FC<PackAddInventoryItemProps> = ({
  type,
  addToPack,
}) => {
  const [query, setQuery] = useState("");
  const [isAddingTo, setIsAddingTo] = useState<string | null>(null);

  const [items, { isLoading }] = useQuery(
    inventoryItemsQuery,
    { type },
    { suspense: false }
  );

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
      <SearchInput setQuery={setQuery} />

      {isLoading && (
        <Center>
          <Spinner />
        </Center>
      )}

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
              isLoading={isAddingTo === item.id}
              onClick={() => {
                setIsAddingTo(item.id);
                addToPack(item.gear.id).then(() => {
                  setIsAddingTo(null);
                });
              }}
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
