import type { BlitzLayout } from "blitz";

import { Container, Grid, GridItem } from "@chakra-ui/layout";

import Header from "app/modules/header/components/header";
import Seo from "app/modules/common/components/seo";

import Navigation from "../components/navigation";

type SidebarLayoutProps = {
  title?: string;
  description?: string;
};

const SidebarLayout: BlitzLayout<SidebarLayoutProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <>
      <Seo title={title} description={description} />

      <Header />

      <Container as="main" maxW="container.lg" py={{ base: 5, md: 10 }}>
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 3fr", lg: "1fr 4fr" }}
          gap={12}
        >
          <GridItem display={{ base: "none", md: "block" }}>
            <Navigation />
          </GridItem>

          <GridItem>{children}</GridItem>
        </Grid>
      </Container>
    </>
  );
};

export default SidebarLayout;