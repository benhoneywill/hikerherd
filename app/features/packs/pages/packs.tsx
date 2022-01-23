import type { BlitzPage } from "blitz";

import { Link, Routes, useQuery } from "blitz";

import { Button } from "@chakra-ui/button";
import { FcTimeline } from "react-icons/fc";
import { Heading, SimpleGrid } from "@chakra-ui/layout";

import SidebarLayout from "app/modules/common/layouts/sidebar-layout";
import LinkCard from "app/modules/common/components/link-card";

import packsQuery from "../queries/packs-query";

const PacksPage: BlitzPage = () => {
  const [packs] = useQuery(packsQuery, {});

  return (
    <>
      <Heading>Packs</Heading>

      <Link href={Routes.NewPackPage()} passHref>
        <Button as="a" colorScheme="green">
          New pack
        </Button>
      </Link>

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
