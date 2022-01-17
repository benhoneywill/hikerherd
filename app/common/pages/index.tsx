import type { BlitzPage } from "blitz";

import { Routes } from "blitz";

import { SimpleGrid } from "@chakra-ui/layout";
import { FcList, FcRating } from "react-icons/fc";

import SidebarLayout from "../layouts/sidebar-layout";
import LinkCard from "../components/link-card";

const HomePage: BlitzPage = () => {
  return (
    <>
      <SimpleGrid columns={2} spacing={4}>
        <LinkCard
          href={Routes.InventoryPage()}
          icon={FcList}
          title="Inventory"
          text="Organize the backpacking gear you own."
        />
        <LinkCard
          href={Routes.WishListPage()}
          icon={FcRating}
          title="Wish list"
          text="Plan the backpacking gear of your dreams."
        />
      </SimpleGrid>
    </>
  );
};

HomePage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default HomePage;
