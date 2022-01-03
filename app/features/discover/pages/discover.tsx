import type { BlitzPage } from "blitz";

import { useQuery } from "blitz";
import { useState } from "react";

import {
  Button,
  Center,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { FcList, FcRating } from "react-icons/fc";

import SidebarLayout from "app/common/layouts/sidebar-layout";
import GearCard from "app/common/components/gear-card";

import searchGearQuery from "../queries/search-gear-query";

const DiscoverPage: BlitzPage = () => {
  const [query, setQuery] = useState("");

  const [items, { isLoading }] = useQuery(
    searchGearQuery,
    { query },
    { suspense: false }
  );

  console.log(items);

  return (
    <Stack spacing={3}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={FaSearch} />
        </InputLeftElement>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search hikerherd for gear..."
        />
      </InputGroup>

      {isLoading && (
        <Center bg="gray.50" borderRadius="md" p={6}>
          <Spinner />
        </Center>
      )}

      {!isLoading && items?.length && (
        <SimpleGrid columns={2} spacing={3}>
          {items?.map((item) => (
            <GearCard
              key={item.id}
              name={item.name}
              weight={item.weight}
              price={item.price}
              consumable={item.consumable}
              link={item.link}
              notes={item.notes}
            >
              <HStack spacing={2}>
                <Button isFullWidth size="sm" leftIcon={<FcList />}>
                  Add to inventory
                </Button>
                <Button isFullWidth size="sm" leftIcon={<FcRating />}>
                  Add to wish list
                </Button>
              </HStack>
            </GearCard>
          ))}
        </SimpleGrid>
      )}

      {!isLoading && !!query && items?.length === 0 && (
        <Center bg="gray.50" borderRadius="md" p={6}>
          <Heading size="md">No results found</Heading>
        </Center>
      )}

      {!isLoading && !query && items?.length === 0 && (
        <Center bg="gray.50" borderRadius="md" p={6}>
          <Heading size="md">Search for something...</Heading>
        </Center>
      )}
    </Stack>
  );
};

DiscoverPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default DiscoverPage;
