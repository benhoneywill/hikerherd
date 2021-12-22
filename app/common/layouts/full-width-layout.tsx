import type { BlitzLayout } from "blitz";

import { Container } from "@chakra-ui/layout";

import Header from "../modules/header/components/header";

import Seo from "./seo";

const FullWidthLayout: BlitzLayout<{ title?: string; padless?: true }> = ({
  title,
  padless,
  children,
}) => {
  return (
    <>
      <Seo title={title} />

      <Header maxWidth="100%" />

      <Container
        as="main"
        maxW="100%"
        py={padless ? 0 : "40px"}
        px={padless && 0}
      >
        {children}
      </Container>
    </>
  );
};

export default FullWidthLayout;
