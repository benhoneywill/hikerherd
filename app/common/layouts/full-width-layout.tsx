import type { BlitzLayout } from "blitz";

import { Container } from "@chakra-ui/layout";

import Header from "../modules/header/components/header";

import Seo from "./seo";

const FullWidthLayout: BlitzLayout<{ title?: string }> = ({
  title,
  children,
}) => {
  return (
    <>
      <Seo title={title} />

      <Header maxWidth="100%" />

      <Container as="main" maxW="100%" py="40px">
        {children}
      </Container>
    </>
  );
};

export default FullWidthLayout;
