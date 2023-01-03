import type { BlitzPage } from "blitz";

import { Routes } from "blitz";
import { Fragment } from "react";

import { SimpleGrid, Container, Heading, Box, Text } from "@chakra-ui/layout";
import {
  FcBinoculars,
  FcPortraitMode,
  FcKindle,
  FcLike,
  FcList,
  FcRating,
  FcSearch,
  FcSettings,
  FcTimeline,
  FcVoicePresentation,
} from "react-icons/fc";
import { useColorModeValue } from "@chakra-ui/react";

import PlainLayout from "app/layouts/plain-layout";
import useCurrentUser from "app/apps/users/hooks/use-current-user";

import IndexCard from "../components/index-card";

const StartPage: BlitzPage = () => {
  const user = useCurrentUser();

  return (
    <Fragment>
      <Box bg={useColorModeValue("gray.50", "gray.800")}>
        <Container
          as="main"
          maxW="container.sm"
          textAlign="center"
          py={{ base: 12, md: 20 }}
        >
          <Heading size="2xl" mb={2}>
            {user?.username}
          </Heading>
          <Text fontSize="xl" opacity="0.8">
            Welcome to hikerherd
          </Text>
        </Container>
      </Box>

      <Container as="main" maxW="container.lg" py={{ base: 12, md: 20 }}>
        <Heading
          fontSize="sm"
          color="gray.500"
          textTransform="uppercase"
          mb={4}
        >
          Gear tools
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          <IndexCard
            icon={FcList}
            href={Routes.InventoryPage()}
            title="Inventory"
            text="Manage your backpacking gear"
          />

          <IndexCard
            icon={FcRating}
            href={Routes.WishListPage()}
            title="Wish list"
            text="Track the gear you want to buy"
          />

          <IndexCard
            icon={FcTimeline}
            href={Routes.PacksPage()}
            title="Packs"
            text="Organize your gear into packs"
          />
        </SimpleGrid>

        <Heading
          fontSize="sm"
          color="gray.500"
          textTransform="uppercase"
          mb={4}
          mt={8}
        >
          Discover
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          <IndexCard
            icon={FcBinoculars}
            href={Routes.DiscoverGearPage()}
            title="Gear search"
            text="Search the hikerherd database for gear"
          />

          <IndexCard
            icon={FcSearch}
            href={Routes.DiscoverPacksPage()}
            title="Pack search"
            text="Look for packs created by other hikers"
          />
        </SimpleGrid>

        <Heading
          fontSize="sm"
          color="gray.500"
          textTransform="uppercase"
          mb={4}
          mt={8}
        >
          Settings
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          <IndexCard
            icon={FcSettings}
            href={Routes.PreferencesPage()}
            title="Your preferences"
            text="Set your preferred units and currency"
          />

          <IndexCard
            icon={FcPortraitMode}
            href={Routes.ProfilePage({ username: user?.username || "" })}
            title="Your profile"
            text="View your own hikerherd profile page"
          />
        </SimpleGrid>

        <Heading
          fontSize="sm"
          color="gray.500"
          textTransform="uppercase"
          mb={4}
          mt={8}
        >
          Other
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {process.env.BLITZ_PUBLIC_NEWSLETTER_LINK && (
            <IndexCard
              icon={FcKindle}
              href={process.env.BLITZ_PUBLIC_NEWSLETTER_LINK}
              title="Newsletter"
              text="Stay up to date with hikerherd news"
            />
          )}

          <IndexCard
            icon={FcVoicePresentation}
            href={Routes.ContactPage()}
            title="Contact me"
            text="Leave me feedback or ask a question"
          />

          {process.env.BLITZ_PUBLIC_SUPPORT_LINK && (
            <IndexCard
              icon={FcLike}
              href={process.env.BLITZ_PUBLIC_SUPPORT_LINK}
              title="Buy me a coffee"
              text="Support the development of hikerherd"
            />
          )}
        </SimpleGrid>
      </Container>
    </Fragment>
  );
};

StartPage.authenticate = { redirectTo: Routes.HomePage() };

StartPage.getLayout = (page) => <PlainLayout>{page}</PlainLayout>;

export default StartPage;
