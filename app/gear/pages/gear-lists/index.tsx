import type { BlitzPage } from "blitz";

import { Link, Routes, usePaginatedQuery } from "blitz";
import { useState } from "react";

import { Button } from "@chakra-ui/button";
import { Link as ChakraLink } from "@chakra-ui/layout";

import ThreeColumnLayout from "app/common/layouts/three-column-layout";

import gearListsQuery from "../../queries/gear-lists-query";

const GearListsPage: BlitzPage = () => {
  const [page] = useState(1);

  const [lists] = usePaginatedQuery(gearListsQuery, {
    skip: 10 * (page - 1),
    take: 10,
  });

  return (
    <>
      <Link href={Routes.NewGearListPage()} passHref>
        <Button as="a">New gear list</Button>
      </Link>
      <ul>
        {lists.items.map((list) => (
          <li key={list.id}>
            <Link href={Routes.GearListPage({ id: list.id })} passHref>
              <ChakraLink>{list.name}</ChakraLink>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

GearListsPage.getLayout = (page) => (
  <ThreeColumnLayout title="Gear lists">{page}</ThreeColumnLayout>
);

export default GearListsPage;
