import type { BlitzLayout } from "blitz";

import { useContext, useEffect } from "react";

import { Flex, Box } from "@chakra-ui/layout";

import Header from "app/components/header/components/header";
import userPreferencesContext from "app/apps/users/contexts/user-preferences-context";

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
  const { compact } = useContext(userPreferencesContext);

  useEffect(() => {
    if (!compact) {
      document.body.classList.add("is-fixed");
      return () => document.body.classList.remove("is-fixed");
    }
  }, [compact]);

  return (
    <Flex
      direction="column"
      height={compact ? "auto" : "100vh"}
      overflowY={compact ? "scroll" : "hidden"}
    >
      <Seo title={title} description={description} />

      <Header />

      {subheader}

      <Box
        flex="1 1 auto"
        width="100vw"
        overflowX="auto"
        overflowY={compact ? "scroll" : "hidden"}
      >
        {children}
      </Box>
    </Flex>
  );
};

export default FixedLayout;
