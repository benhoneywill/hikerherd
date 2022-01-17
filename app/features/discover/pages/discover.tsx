import type { BlitzPage } from "blitz";
import type { CategoryType } from "@prisma/client";

import { useSession, useQuery } from "blitz";
import { useState } from "react";

import {
  Button,
  Center,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { FcList, FcRating } from "react-icons/fc";

import SidebarLayout from "app/common/layouts/sidebar-layout";
import GearCard from "app/common/components/gear-card";
import SearchInput from "app/common/components/search-input";
import useModeColors from "app/common/hooks/use-mode-colors";

import searchGearQuery from "../queries/search-gear-query";
import AddToInventoryForm from "../components/add-to-inventory-form";

const DiscoverPage: BlitzPage = () => {
  const session = useSession({ suspense: false });
  const [query, setQuery] = useState("");
  const { gray } = useModeColors();
  const toast = useToast();

  const [adding, setAdding] = useState<{
    type: CategoryType;
    id: string;
  } | null>(null);

  const [items, { isLoading }] = useQuery(
    searchGearQuery,
    { query },
    { suspense: false }
  );

  return (
    <>
      <AddToInventoryForm
        isOpen={!!adding}
        onClose={() => setAdding(null)}
        gearId={adding?.id}
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
      <Stack spacing={3}>
        <SearchInput setQuery={setQuery} />

        {isLoading && (
          <Center bg={gray[50]} borderRadius="md" p={6}>
            <Spinner />
          </Center>
        )}

        {!isLoading && items?.length && (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
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
                {session.userId && (
                  <HStack spacing={2}>
                    <Button
                      isFullWidth
                      size="sm"
                      leftIcon={<FcList />}
                      onClick={() =>
                        setAdding({ type: "INVENTORY", id: item.id })
                      }
                    >
                      Add to inventory
                    </Button>
                    <Button
                      isFullWidth
                      size="sm"
                      leftIcon={<FcRating />}
                      onClick={() =>
                        setAdding({ type: "INVENTORY", id: item.id })
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

        {!isLoading && !!query && items?.length === 0 && (
          <Center bg={gray[50]} borderRadius="md" p={6}>
            <Heading size="md">No gear found for &quot;{query}&quot; </Heading>
          </Center>
        )}

        {!isLoading && !query && items?.length === 0 && (
          <Center bg={gray[50]} borderRadius="md" p={6}>
            <Heading size="md">Search for gear...</Heading>
          </Center>
        )}
      </Stack>
    </>
  );
};

DiscoverPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default DiscoverPage;
