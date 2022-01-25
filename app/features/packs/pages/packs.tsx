import type { BlitzPage } from "blitz";

import { useRouter, Routes, useQuery } from "blitz";
import { useState } from "react";

import { Button } from "@chakra-ui/button";
import { FcTimeline } from "react-icons/fc";
import { Heading, SimpleGrid, HStack, Text, Stack } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/react";

import SidebarLayout from "app/modules/common/layouts/sidebar-layout";
import LinkCard from "app/modules/common/components/link-card";
import Card from "app/modules/common/components/card";

import packsQuery from "../queries/packs-query";
import PackForm from "../components/pack-form";

const PacksPage: BlitzPage = () => {
  const router = useRouter();
  const [packs] = useQuery(packsQuery, {});
  const [addingNewPack, setAddingNewPack] = useState(false);

  return (
    <>
      <HStack mb={6} justify="space-between">
        <Heading size="md">Packs</Heading>

        <Button
          as="a"
          colorScheme="green"
          onClick={() => setAddingNewPack(true)}
          size="sm"
          cursor="pointer"
        >
          New pack
        </Button>
      </HStack>

      <PackForm
        isOpen={addingNewPack}
        onClose={() => setAddingNewPack(false)}
        onSuccess={(pack) => {
          router.push(Routes.PackPage({ packId: pack.id }));
        }}
      />

      {packs.length === 0 && (
        <Card>
          <Stack alignItems="center">
            <Icon w={10} h={10} as={FcTimeline} />
            <Text color="gray.500">You have not created any packs yet</Text>
          </Stack>
        </Card>
      )}

      {packs.length >= 1 && (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
          {packs.map((pack) => (
            <LinkCard
              key={pack.id}
              href={Routes.PackPage({ packId: pack.id })}
              icon={FcTimeline}
              title={pack.name}
            />
          ))}
        </SimpleGrid>
      )}
    </>
  );
};

PacksPage.authenticate = { redirectTo: Routes.LoginPage() };
PacksPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default PacksPage;