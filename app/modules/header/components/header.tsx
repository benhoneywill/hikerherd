import type { FC } from "react";

import { useState, Fragment } from "react";
import { useSession } from "blitz";

import { Box, Container, Grid, GridItem } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/react";

import HeaderDrawer from "./header-drawer";
import HeaderActions from "./header-actions";
import HeaderLogo from "./header-logo";
import HeaderLoggedOut from "./header-logged-out";
import HeaderLoggedIn from "./header-logged-in";
import BetaBanner from "./beta-banner";

const Header: FC = () => {
  const session = useSession({ suspense: false });

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const toggleDrawer = () => setDrawerIsOpen((state) => !state);

  const isLoggedIn = !!session.userId;
  const isLoggedOut = !session.userId && !session.isLoading;

  return (
    <Fragment>
      <HeaderDrawer
        isOpen={drawerIsOpen}
        onClose={() => setDrawerIsOpen(false)}
      />

      <Box position="sticky" top="0" zIndex={2}>
        <BetaBanner />
        <Box
          as="header"
          py={3}
          bg={useColorModeValue("white", "gray.700")}
          borderBottom="1px solid"
          borderBottomColor={useColorModeValue("gray.200", "gray.800")}
          transition="border 0.2s ease"
        >
          <Container maxW="100%">
            <Grid
              templateColumns={{ base: "auto 1fr 1fr", md: "1fr auto 1fr" }}
              alignItems="center"
              gap={3}
            >
              <GridItem>
                <HeaderActions toggleDrawer={toggleDrawer} />
              </GridItem>

              <GridItem order={{ base: -1, md: 0 }}>
                <HeaderLogo />
              </GridItem>

              <GridItem>
                {isLoggedOut && <HeaderLoggedOut />}
                {isLoggedIn && <HeaderLoggedIn />}
              </GridItem>
            </Grid>
          </Container>
        </Box>
      </Box>
    </Fragment>
  );
};

export default Header;
