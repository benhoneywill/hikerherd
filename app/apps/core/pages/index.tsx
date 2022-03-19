import type { BlitzPage } from "blitz";

import { Routes } from "blitz";
import { Fragment } from "react";

import { SimpleGrid, Heading, Text, Link as Anchor } from "@chakra-ui/layout";
import { FcList, FcRating, FcSearch, FcTimeline } from "react-icons/fc";
import { useColorModeValue } from "@chakra-ui/react";

import SidebarLayout from "app/layouts/sidebar-layout";

import IndexCard from "../components/index-card";

const HomePage: BlitzPage = () => {
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Fragment>
      <Heading mb={4} size="md">
        Welcome to hikerherd
      </Heading>

      <Text mb={2} color={textColor}>
        <strong>hikerherd</strong> helps you manage your backpacking gear and
        plan your adventures.
      </Text>

      <Text mb={5} color={textColor}>
        hikerherd is still in <strong>beta</strong>, so if you have any feedback
        please{" "}
        <Anchor
          href="https://blog.hikerherd.com/contact"
          textDecoration="underline"
          isExternal
        >
          get in touch
        </Anchor>
        .
      </Text>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
        <IndexCard
          icon={FcList}
          href={Routes.InventoryPage()}
          title="Inventory"
          text="Organize the backpacking gear you own"
        />

        <IndexCard
          icon={FcRating}
          href={Routes.WishListPage()}
          title="Wish list"
          text="Plan the backpacking gear of your dreams."
        />

        <IndexCard
          icon={FcTimeline}
          href={Routes.PacksPage()}
          title="Packs"
          text="Plan for a trip by organizing gear into packs."
        />

        <IndexCard
          icon={FcSearch}
          href={Routes.DiscoverGearPage()}
          title="Discover"
          text="Search the hikerherd database for gear."
        />
      </SimpleGrid>
    </Fragment>
  );
};

HomePage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default HomePage;
