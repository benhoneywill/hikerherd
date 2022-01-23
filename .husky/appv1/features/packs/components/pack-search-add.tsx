import type { FC } from "react";

import { useQuery } from "blitz";
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

type PackSearchAddProps = {
  addToPack: (gearId: string) => Promise<void>;
};

const PackSearchAdd: FC<PackSearchAddProps> = ({ addToPack }) => {
  const [query, setQuery] = useState("");
  const [isAdding, setIsAdding] = useState<string | null>(null);

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
                  setIsAdding(item.id);
                  await addToPack(item.id);
                  setIsAdding(null);
                }}
                colorScheme="green"
              >
                Add to pack
              </Button>
            </GearCard>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
};

export default PackSearchAdd;
