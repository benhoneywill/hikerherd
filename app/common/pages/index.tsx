import type { BlitzPage } from "blitz";

import { Routes } from "blitz";

import { SimpleGrid } from "@chakra-ui/layout";
import { FcList, FcRating, FcSearch, FcTimeline } from "react-icons/fc";

import SidebarLayout from "../layouts/sidebar-layout";
import LinkCard from "../components/link-card";

const HomePage: BlitzPage = () => {
  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
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
      <LinkCard
        href={Routes.PacksPage()}
        icon={FcTimeline}
        title="Packs"
        text="Plan for a trip by organizing gear into packs."
      />
      <LinkCard
        href={Routes.DiscoverPage()}
        icon={FcSearch}
        title="Discover"
        text="Search the hikerherd database for gear."
      />
    </SimpleGrid>
  );
};

HomePage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default HomePage;
