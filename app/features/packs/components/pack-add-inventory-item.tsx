import type { FC } from "react";
import type { CategoryType } from "db";

import { useMemo, useState } from "react";
import { useQuery } from "blitz";

import Fuse from "fuse.js";
import { Button, SimpleGrid, Stack } from "@chakra-ui/react";

import GearCard from "app/modules/gear-card/components/gear-card";
import SearchInput from "app/features/discover/components/search-input";
import listCategoryGearQuery from "app/features/category-gear/queries/list-category-gear-query";
import displayCategoryType from "app/features/categories/helpers/display-category-type";
import SearchResults from "app/features/discover/components/search-results";

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
    listCategoryGearQuery,
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

  const typeName = displayCategoryType(type);

  return (
    <Stack spacing={3}>
      <SearchInput setQuery={setQuery} />

      <SearchResults
        query={query}
        message={`Search your ${typeName} for gear to add`}
        isLoading={isLoading}
        items={filteredItems}
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
          {filteredItems.map(({ item }) => (
            <GearCard
              key={item.id}
              name={item.gear.name}
              weight={item.gear.weight}
              price={item.gear.price}
              currency={item.gear.currency}
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
      </SearchResults>
    </Stack>
  );
};

export default PackAddInventoryItem;
