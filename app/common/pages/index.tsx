import type { BlitzPage } from "blitz";

import { Link, Routes } from "blitz";

import { Stack, Heading, SimpleGrid, Text } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/icon";
import { FcList, FcRating } from "react-icons/fc";
import { useColorModeValue } from "@chakra-ui/react";

import SidebarLayout from "../layouts/sidebar-layout";

const HomePage: BlitzPage = () => {
  return (
    <>
      <SimpleGrid columns={2} spacing={4}>
        <Link href={Routes.InventoryPage()} passHref>
          <Stack
            as="a"
            bg={useColorModeValue("gray.50", "gray.700")}
            boxShadow="sm"
            py={6}
            px={4}
            borderRadius="md"
            align="center"
            textAlign="center"
          >
            <Icon mt={1} as={FcList} w={8} h={8} />
            <Heading size="md">Inventory</Heading>
            <Text opacity="0.6">Organize the backpacking gear you own.</Text>
          </Stack>
        </Link>
        <Link href={Routes.WishListPage()} passHref>
          <Stack
            as="a"
            bg={useColorModeValue("gray.50", "gray.700")}
            boxShadow="sm"
            py={6}
            px={4}
            borderRadius="md"
            align="center"
            textAlign="center"
          >
            <Icon mt={1} as={FcRating} w={8} h={8} />
            <Heading size="md">Wish list</Heading>
            <Text opacity="0.6">Plan the backpacking gear of your dreams.</Text>
          </Stack>
        </Link>
      </SimpleGrid>
    </>
  );
};

HomePage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default HomePage;
