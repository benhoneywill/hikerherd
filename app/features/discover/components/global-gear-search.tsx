import type { Gear } from "db";
import type { FC } from "react";

import { useQuery } from "blitz";
import { useState } from "react";

import { SimpleGrid, Stack } from "@chakra-ui/react";

import GearCard from "app/modules/gear-card/components/gear-card";

import searchGearQuery from "../queries/search-gear-query";

import SearchInput from "./search-input";
import SearchResults from "./search-results";

type GlobalGearSearchProps = {
  gearActions: (item: Gear) => JSX.Element;
};

const GlobalGearSearch: FC<GlobalGearSearchProps> = ({ gearActions }) => {
  const [query, setQuery] = useState("");

  const [items, { isLoading }] = useQuery(
    searchGearQuery,
    { query },
    { suspense: false, enabled: !!query }
  );

  return (
    <Stack spacing={3}>
      <SearchInput setQuery={setQuery} />

      <SearchResults
        message="Use the input above to search hikerherd for gear"
        query={query}
        items={items || []}
        isLoading={isLoading}
      >
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={3}>
          {items?.map((item) => (
            <GearCard
              key={item.id}
              name={item.name}
              weight={item.weight}
              price={item.price}
              currency={item.currency}
              consumable={item.consumable}
              link={item.link}
              notes={item.notes}
            >
              {gearActions(item)}
            </GearCard>
          ))}
        </SimpleGrid>
      </SearchResults>
    </Stack>
  );
};

export default GlobalGearSearch;
