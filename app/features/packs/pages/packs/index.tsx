import type { BlitzPage } from "blitz";

import { Link, Routes, useQuery } from "blitz";

import { Button } from "@chakra-ui/button";
import { FcTimeline } from "react-icons/fc";
import { SimpleGrid, Stack } from "@chakra-ui/layout";

import SidebarLayout from "app/common/layouts/sidebar-layout";
import LinkCard from "app/common/components/link-card";

import packsQuery from "../../queries/packs-query";

const PacksPage: BlitzPage = () => {
  const [packs] = useQuery(packsQuery, {});

  return (
    <>
      <Stack direction="row" justify="flex-end" mb={6}>
        <Link href={Routes.NewPackPage()} passHref>
          <Button as="a" colorScheme="green">
            New pack
          </Button>
        </Link>
      </Stack>

      <SimpleGrid columns={2} spacing={4}>
        {packs.map((pack) => (
          <LinkCard
            key={pack.id}
            href={Routes.PackPage({ packId: pack.id })}
            icon={FcTimeline}
            title={pack.name}
            text="Manage this pack"
          />
        ))}
      </SimpleGrid>
    </>
  );
};

PacksPage.authenticate = { redirectTo: Routes.LoginPage() };
PacksPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default PacksPage;
