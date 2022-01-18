import type { BlitzPage } from "blitz";
import type { CategoryType, Gear } from "@prisma/client";

import { useSession, useQuery } from "blitz";
import { useState } from "react";

import {
  Button,
  Center,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FcList, FcRating, FcSearch } from "react-icons/fc";

import SidebarLayout from "app/common/layouts/sidebar-layout";
import GearCard from "app/common/components/gear-card";
import SearchInput from "app/common/components/search-input";
import useModeColors from "app/common/hooks/use-mode-colors";
import PageHeader from "app/common/components/page-header";

import searchGearQuery from "../queries/search-gear-query";
import AddToInventoryForm from "../components/add-to-inventory-form";

const DiscoverPage: BlitzPage = () => {
  const session = useSession({ suspense: false });
  const [query, setQuery] = useState("");
  const { gray } = useModeColors();
  const toast = useToast();

  const [adding, setAdding] = useState<{
    type: CategoryType;
    gear: Gear;
  } | null>(null);

  const [items, { isLoading }] = useQuery(
    searchGearQuery,
    { query },
    { suspense: false, enabled: !!query }
  );

  return (
    <>
      <AddToInventoryForm
        isOpen={!!adding}
        onClose={() => setAdding(null)}
        gear={adding?.gear}
        type={adding?.type}
        onSuccess={() => {
          setAdding(null);
          toast({
            title: "Success",
            description: "The gear was added successfully.",
            status: "success",
          });
        }}
      />

      <PageHeader title="Discover" icon={FcSearch} />

      <Stack spacing={3}>
        <SearchInput setQuery={setQuery} />

        {isLoading && (
          <HStack bg={gray[50]} p={6} justify="center" spacing={4}>
            <Spinner />
            <Heading size="md">Searching...</Heading>
          </HStack>
        )}

        {!query && (
          <Stack
            bg={gray[50]}
            borderRadius="md"
            p={6}
            align="center"
            textAlign="center"
          >
            <Heading size="md">Search hikerherd for gear...</Heading>
            <Text opacity={0.6}>
              Use the search input above to search the hikerherd gear database.
            </Text>
          </Stack>
        )}

        {items?.length === 0 && (
          <Center bg={gray[50]} borderRadius="md" p={6}>
            <Heading size="md">No gear found for &quot;{query}&quot; </Heading>
          </Center>
        )}

        {!isLoading && items?.length && (
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
                type={item.type}
              >
                {session.userId && (
                  <HStack spacing={2}>
                    <Button
                      isFullWidth
                      size="sm"
                      leftIcon={<FcList />}
                      onClick={() =>
                        setAdding({ type: "INVENTORY", gear: item })
                      }
                    >
                      Add to inventory
                    </Button>
                    <Button
                      isFullWidth
                      size="sm"
                      leftIcon={<FcRating />}
                      onClick={() =>
                        setAdding({ type: "WISH_LIST", gear: item })
                      }
                    >
                      Add to wish list
                    </Button>
                  </HStack>
                )}
              </GearCard>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </>
  );
};

DiscoverPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default DiscoverPage;
