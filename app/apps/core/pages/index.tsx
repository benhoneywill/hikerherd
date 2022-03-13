import type { BlitzPage } from "blitz";

import { Routes } from "blitz";
import { Fragment } from "react";

import { SimpleGrid, Heading, Text, Link } from "@chakra-ui/layout";
import { FcList, FcRating, FcSearch, FcTimeline } from "react-icons/fc";
import { useColorModeValue } from "@chakra-ui/react";

import SidebarLayout from "app/layouts/sidebar-layout";
import LinkCard from "app/components/link-card";

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
        <Link
          href="https://blog.hikerherd.com/contact"
          textDecoration="underline"
          isExternal
        >
          get in touch
        </Link>
        .
      </Text>

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
    </Fragment>
  );
};

HomePage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default HomePage;
