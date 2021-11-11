import type { BlitzLayout } from "blitz";

import { Head } from "blitz";

import { Box } from "@chakra-ui/layout";

import { Header } from "../components/header";

export const Layout: BlitzLayout<{ title?: string }> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title || "blitz"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Box as="main" px={3} py={6}>
        {children}
      </Box>
    </>
  );
};
