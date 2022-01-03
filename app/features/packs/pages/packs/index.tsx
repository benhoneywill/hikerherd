import type { BlitzPage } from "blitz";

import { Link, Routes, useQuery } from "blitz";

import { Button } from "@chakra-ui/button";

import SidebarLayout from "app/common/layouts/sidebar-layout";

import packsQuery from "../../queries/packs-query";

const PacksPage: BlitzPage = () => {
  const [packs] = useQuery(packsQuery, {});

  return (
    <>
      <Link href={Routes.NewPackPage()} passHref>
        <Button as="a" colorScheme="green">
          New pack
        </Button>
      </Link>

      <ul>
        {packs.map((pack) => (
          <li key={pack.id}>
            <Link href={Routes.PackPage({ id: pack.id })} passHref>
              <a>{pack.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

PacksPage.authenticate = { redirectTo: Routes.LoginPage() };
PacksPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default PacksPage;
