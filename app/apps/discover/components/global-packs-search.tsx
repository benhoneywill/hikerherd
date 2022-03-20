import type { Pack } from "db";
import type { FC } from "react";

import { useQuery } from "blitz";
import { useState } from "react";

import { SimpleGrid, Stack } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/react";

import PackCard from "app/apps/packs/components/pack-card";

import searchPacksQuery from "../queries/search-packs-query";

import SearchInput from "./search-input";
import SearchResults from "./search-results";

type GlobalPacksSearchProps = {
  packActions?: (item: Pack) => JSX.Element;
};

const GlobalPacksSearch: FC<GlobalPacksSearchProps> = ({ packActions }) => {
  const [query, setQuery] = useState("");

  const cardBg = useColorModeValue("gray.50", "gray.800");
  const border = useColorModeValue("gray.100", "gray.900");

  const [items, { isLoading }] = useQuery(
    searchPacksQuery,
    { query },
    { suspense: false, enabled: !!query }
  );

  return (
    <Stack spacing={3}>
      <SearchInput setQuery={setQuery} />

      <SearchResults
        message="Start typing to search hikerherd for gear"
        query={query}
        items={items || []}
        isLoading={isLoading}
      >
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={3}>
          {items?.map((item) => (
            <PackCard
              key={item.id}
              pack={item}
              user={item.user}
              actions={packActions && packActions(item)}
              shareLink
              bg={cardBg}
              borderColor={border}
            />
          ))}
        </SimpleGrid>
      </SearchResults>
    </Stack>
  );
};

export default GlobalPacksSearch;
