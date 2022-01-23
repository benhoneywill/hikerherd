import type { BlitzPage } from "blitz";

import { Link, Routes, useQuery } from "blitz";

import { Button } from "@chakra-ui/button";
import { FcTimeline } from "react-icons/fc";
import { SimpleGrid, Stack } from "@chakra-ui/layout";

import SidebarLayout from "app/common/layouts/sidebar-layout";
import LinkCard from "app/common/components/link-card";
import PageHeader from "app/common/components/page-header";

import packsQuery from "../../queries/packs-query";

const PacksPage: BlitzPage = () => {
  const [packs] = useQuery(packsQuery, {});

  return (
    <>
      <PageHeader title="Packs" icon={FcTimeline}>
        {packs.length >= 1 && (
          <Link href={Routes.NewPackPage()} passHref>
            <Button as="a" colorScheme="green">
              New pack
            </Button>
          </Link>
        )}
      </PageHeader>

      {packs.length === 0 && (
        <LinkCard
          href={Routes.NewPackPage()}
          icon={FcTimeline}
          title="Create your first pack"
          text="You haven't created any packs yet! Click this box to get started."
        />
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
