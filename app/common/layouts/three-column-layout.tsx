import type { BlitzLayout } from "blitz";

import { Container, Grid, GridItem } from "@chakra-ui/layout";

import Header from "../modules/header/components/header";
import SidebarNav from "../components/sidebar-nav";

import Seo from "./seo";

const ThreeColumnLayout: BlitzLayout<{ title?: string }> = ({
  title,
  children,
}) => {
  return (
    <>
      <Seo title={title} />

      <Header />

      <Container as="main" maxW="container.lg" pt="40px">
        <Grid
          templateColumns={{ base: "1fr", md: "3fr 1fr", lg: "1fr 3fr 1fr" }}
          gap={6}
        >
          <GridItem display={{ base: "none", lg: "block" }}>
            <SidebarNav />
          </GridItem>

          <GridItem>{children}</GridItem>

          <GridItem>Third column content</GridItem>
        </Grid>
      </Container>
    </>
  );
};

export default ThreeColumnLayout;
