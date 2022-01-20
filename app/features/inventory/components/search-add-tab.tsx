import type { FC } from "react";
import type { CategoryType } from "@prisma/client";

import { useMutation, useQuery } from "blitz";
import { useState } from "react";

import {
  Button,
  Center,
  Text,
  SimpleGrid,
  Spinner,
  Stack,
} from "@chakra-ui/react";

import GearCard from "app/common/components/gear-card";
import SearchInput from "app/common/components/search-input";
import searchGearQuery from "app/features/discover/queries/search-gear-query";
import addToInventoryMutation from "app/features/discover/mutations/add-to-inventory-mutation";

type SearchAddTabProps = {
  categoryId?: string | null;
  onSuccess: () => void;
  type: CategoryType;
};

const SearchAddTab: FC<SearchAddTabProps> = ({
  categoryId,
  onSuccess,
  type,
}) => {
  const [query, setQuery] = useState("");
  const [isAdding, setIsAdding] = useState<string | null>(null);

  const [addToCategory] = useMutation(addToInventoryMutation);

  const [items, { isLoading }] = useQuery(
    searchGearQuery,
    { query },
    { suspense: false, enabled: !!query }
  );

  return (
    <Stack spacing={3}>
      <SearchInput setQuery={setQuery} />

      {isLoading && (
        <Center>
          <Spinner />
        </Center>
      )}

      {!query && <Text>Search hikerherd for gear...</Text>}

      {items?.length === 0 && (
        <Text>No gear found for &quot;{query}&quot; </Text>
      )}

      {!isLoading && items?.length && (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
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
              <Button
                isFullWidth
                size="sm"
                isLoading={isAdding === item.id}
                onClick={async () => {
                  if (!categoryId) return;
                  setIsAdding(item.id);
                  await addToCategory({ categoryId, id: item.id, type });
                  setIsAdding(null);
                  onSuccess();
                }}
                colorScheme="green"
              >
                Add
              </Button>
            </GearCard>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
};

export default SearchAddTab;
