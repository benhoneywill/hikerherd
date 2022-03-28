import type { BlitzPage } from "blitz";

import { Fragment } from "react";

import { Heading, Text } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/react";

import SidebarLayout from "app/layouts/sidebar-layout";
import Card from "app/components/card";

import GlobalPacksSearch from "../../components/global-packs-search";

const DiscoverPacksPage: BlitzPage = () => {
  const textColor = useColorModeValue("gray.600", "gray.400");
  return (
    <Fragment>
      <Heading mb={4} size="md">
        Pack search
      </Heading>

      <Text mb={5} color={textColor}>
        Search hikerherd for packs created by other hikers.
      </Text>

      <Card>
        <GlobalPacksSearch />
      </Card>
    </Fragment>
  );
};

DiscoverPacksPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default DiscoverPacksPage;
