import type { BlitzLayout } from "blitz";

import { Container } from "@chakra-ui/layout";

import Header from "../modules/header/components/header";

import Seo from "./seo";

const SingleColumnLayout: BlitzLayout<{ title?: string }> = ({
  title,
  children,
}) => {
  return (
    <>
      <Seo title={title} />

      <Header />

      <Container as="main" maxW="container.md" pt="40px">
        {children}
      </Container>
    </>
  );
};

export default SingleColumnLayout;
