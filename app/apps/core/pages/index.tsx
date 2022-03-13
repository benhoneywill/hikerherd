import type { BlitzPage } from "blitz";

import { Routes } from "blitz";
import { Fragment } from "react";

import { SimpleGrid, Heading, Text, Link, Stack } from "@chakra-ui/layout";
import { FcList, FcRating, FcSearch, FcTimeline } from "react-icons/fc";
import { useColorModeValue } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icon";

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
        <LinkCard href={Routes.InventoryPage()}>
          <Stack align="center" textAlign="center" x={2}>
            <Icon mt={1} as={FcList} w={8} h={8} />
            <Heading size="md">Inventory</Heading>
            <Text opacity="0.6">Organize the backpacking gear you own</Text>
          </Stack>
        </LinkCard>

        <LinkCard href={Routes.WishListPage()}>
          <Stack align="center" textAlign="center" x={2}>
            <Icon mt={1} as={FcRating} w={8} h={8} />
            <Heading size="md">Wish list</Heading>
            <Text opacity="0.6">Plan the backpacking gear of your dreams.</Text>
          </Stack>
        </LinkCard>

        <LinkCard href={Routes.PacksPage()}>
          <Stack align="center" textAlign="center" x={2}>
            <Icon mt={1} as={FcTimeline} w={8} h={8} />
            <Heading size="md">Packs</Heading>
            <Text opacity="0.6">
              Plan for a trip by organizing gear into packs.
            </Text>
          </Stack>
        </LinkCard>

        <LinkCard href={Routes.DiscoverPage()}>
          <Stack align="center" textAlign="center" x={2}>
            <Icon mt={1} as={FcSearch} w={8} h={8} />
            <Heading size="md">Discover</Heading>
            <Text opacity="0.6">Search the hikerherd database for gear.</Text>
          </Stack>
        </LinkCard>
      </SimpleGrid>
    </Fragment>
  );
};

HomePage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default HomePage;
