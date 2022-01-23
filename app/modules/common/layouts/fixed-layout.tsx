import type { BlitzLayout } from "blitz";

import { Flex, Box } from "@chakra-ui/layout";

import Header from "app/modules/header/components/header";

import Seo from "../components/seo";

type FixedLayoutProps = {
  title?: string;
  description?: string;
  subheader?: JSX.Element;
};

const FixedLayout: BlitzLayout<FixedLayoutProps> = ({
  title,
  description,
  subheader = null,
  children,
}) => {
  return (
    <Flex direction="column" height="100vh" overflowY="hidden">
      <Seo title={title} description={description} />

      <Header />

      {subheader}

      <Box flex="1 1 auto" width="100vw" overflowX="auto" overflowY="hidden">
        {children}
      </Box>
    </Flex>
  );
};

export default FixedLayout;
