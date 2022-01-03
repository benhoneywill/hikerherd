import type { FC } from "react";

import { useSession } from "blitz";

import { Box, Container, Grid, GridItem } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/react";

import HeaderProvider from "./header-provider";
import HeaderDrawer from "./header-drawer";
import HeaderActions from "./header-actions";
import HeaderLogo from "./header-logo";
import HeaderLoggedOut from "./header-logged-out";
import HeaderLoggedIn from "./header-logged-in";

const Header: FC = () => {
  const session = useSession({ suspense: false });

  const isLoggedIn = !!session.userId;
  const isLoggedOut = !session.userId && !session.isLoading;

  return (
    <HeaderProvider>
      <HeaderDrawer />

      <Box
        as="header"
        py={3}
        bg={useColorModeValue("gray.50", "gray.700")}
        borderTop="3px solid"
        borderBottom="1px solid"
        borderTopColor={useColorModeValue("cyan.400", "cyan.700")}
        borderBottomColor={useColorModeValue("gray.200", "gray.600")}
        position="sticky"
        top="0"
        zIndex={2}
      >
        <Container maxW="100%">
          <Grid
            templateColumns={{ base: "auto 1fr 1fr", md: "1fr auto 1fr" }}
            alignItems="center"
            gap={3}
          >
            <GridItem>
              <HeaderActions />
            </GridItem>

            <GridItem
              justify={{ base: "flex-start", md: "center" }}
              order={{ base: -1, md: 0 }}
            >
              <HeaderLogo />
            </GridItem>

            <GridItem>
              {isLoggedOut && <HeaderLoggedOut />}
              {isLoggedIn && <HeaderLoggedIn />}
            </GridItem>
          </Grid>
        </Container>
      </Box>
    </HeaderProvider>
  );
};

export default Header;
