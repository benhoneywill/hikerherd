import type { FC } from "react";
import type { CategoryType } from "db";
import type { PromiseReturnType } from "blitz";

import { useMemo, useState } from "react";
import { useQuery } from "blitz";

import Fuse from "fuse.js";
import { SimpleGrid, Stack, Heading, Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { useColorModeValue } from "@chakra-ui/react";

import GearCard from "app/apps/gear/components/gear-card/components/gear-card";
import SearchInput from "app/apps/discover/components/search-input";
import listCategoryGearQuery from "app/apps/category-gear/queries/list-category-gear-query";
import displayCategoryType from "app/apps/categories/helpers/display-category-type";
import SearchResults from "app/apps/discover/components/search-results";

type GroupedItems = {
  category: string;
  index: number;
  items: PromiseReturnType<typeof listCategoryGearQuery>;
};

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

  const bg = useColorModeValue("gray.50", "gray.600");
  const fg = useColorModeValue("white", "gray.700");
  const border = useColorModeValue("gray.200", "gray.800");

  const [categoryGear, { isLoading }] = useQuery(
    listCategoryGearQuery,
    { type },
    { suspense: false }
  );

  const filteredItems = useMemo(() => {
    if (!categoryGear) return [];

    if (!query) {
      return categoryGear;
    }

    const fuse = new Fuse(categoryGear, {
      keys: ["gear.name", "gear.notes"],
    });

    return fuse.search(query).map(({ item }) => item);
  }, [categoryGear, query]);

  const groupedItems = useMemo(() => {
    return filteredItems.reduce((groups, item) => {
      const items: GroupedItems["items"] =
        groups[item.category.index]?.items || [];

      groups[item.category.index] = {
        category: item.category.name,
        index: item.category.index,
        items: [...items, item],
      };

      return groups;
    }, [] as GroupedItems[]);
  }, [filteredItems]);

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
        <Stack spacing={4} bg={bg} m={-4} mt={2} p={4}>
          {groupedItems.map((group) => (
            <Box
              key={group.index}
              border="1px solid"
              borderColor={border}
              bg={fg}
              borderRadius="md"
            >
              <Heading size="sm" p={3} pb={1}>
                {group.category}
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} p={2}>
                {group.items.map((item) => (
                  <GearCard
                    key={item.id}
                    name={item.gear.name}
                    weight={item.gear.weight}
                    price={item.gear.price}
                    currency={item.gear.currency}
                    consumable={item.gear.consumable}
                    link={item.gear.link}
                    notes={item.gear.notes}
                    imageUrl={item.gear.imageUrl}
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
            </Box>
          ))}
        </Stack>
      </SearchResults>
    </Stack>
  );
};

export default PackAddInventoryItem;
