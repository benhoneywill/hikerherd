import type { BlitzPage } from "blitz";
import type { IconType } from "react-icons";
import type { FC } from "react";

import { Link, Routes } from "blitz";
import { Fragment } from "react";

import {
  Heading,
  Box,
  Container,
  SimpleGrid,
  Text,
  Stack,
  Link as Anchor,
} from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Icon } from "@chakra-ui/icon";
import { Image } from "@chakra-ui/image";
import { DarkMode, useColorModeValue } from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import {
  FcBinoculars,
  FcList,
  FcRating,
  FcSearch,
  FcTimeline,
} from "react-icons/fc";

import PlainLayout from "app/layouts/plain-layout";

type IconCardProps = {
  icon: IconType;
  title: string;
  text: string | JSX.Element;
};

const IconCard: FC<IconCardProps> = ({ icon, title, text }) => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      px={4}
      py={6}
      borderRadius="md"
      align="center"
      spacing={2}
    >
      <Icon as={icon} w={8} h={8} />
      <Heading size="md">{title}</Heading>
      <Text opacity="0.8">{text}</Text>
    </Stack>
  );
};

const HomePage: BlitzPage = () => {
  return (
    <Fragment>
      <Box bg={useColorModeValue("gray.50", "gray.800")}>
        <Container
          as="main"
          maxW="container.sm"
          textAlign="center"
          py={{ base: 12, md: 20 }}
        >
          <Heading size="xl" mb={4}>
            Lighten your pack with hikerherd
          </Heading>
          <Text fontSize="lg" opacity="0.8">
            The first step towards an ultralight pack is knowing where your
            weight is coming from. <strong>hikerherd</strong> makes it simple.
          </Text>
          <Link href={Routes.SignupPage()} passHref>
            <Button
              mt={8}
              size="lg"
              as="a"
              rightIcon={<FaArrowRight />}
              colorScheme="blue"
            >
              Get started today
            </Button>
          </Link>
          <Text fontSize="sm" opacity="0.6" mt={3}>
            hikerherd is <strong>free</strong> and{" "}
            <Anchor
              textDecoration="underline"
              isExternal
              href="https://github.com/benhoneywill/hikerherd"
            >
              open-source
            </Anchor>
          </Text>
        </Container>
      </Box>

      <Container
        as="main"
        maxW="container.lg"
        pb={{ base: 16, md: 24 }}
        pt={{ base: 12, md: 20 }}
        textAlign="center"
      >
        <Heading size="lg" mb={4}>
          How does it work?
        </Heading>
        <Text fontSize="lg" opacity="0.8">
          Our gear tools make it simple to organize your gear closet and plan
          your trips.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt={12}>
          <IconCard
            icon={FcList}
            title="Organize your inventory"
            text="hikerherd gives you a central location to manage all of your gear."
          />

          <IconCard
            icon={FcRating}
            title="Track your wish list"
            text="Keep track of any gear you want to buy complete with links, prices and more."
          />

          <IconCard
            icon={FcTimeline}
            title="Plan packs"
            text="Bring gear from your inventory and wish list together into packing lists."
          />
        </SimpleGrid>
      </Container>

      <Box bg="gray.700" color="white">
        <Container
          as="main"
          maxW="container.lg"
          py={{ base: 16, md: 24 }}
          textAlign="center"
        >
          <Heading size="lg" mb={4}>
            Pack analytics
          </Heading>
          <Text fontSize="lg" opacity="0.8">
            <strong>hikerherd</strong> gives you the analytics tools you need to
            decide what to take on your trip and what to leave at home.
          </Text>

          <Image
            mx="auto"
            my={12}
            alt="Screenshot of piechart and table"
            borderRadius="md"
            w="750px"
            maxW="100%"
            src="/pack-analytics.png"
            boxShadow="lg"
          />

          <DarkMode>
            <Link
              href="https://www.hikerherd.com/packs/share/cl1b8mi9n01882gnlqntpniox"
              passHref
            >
              <Button as="a" size="lg">
                Check out an example pack
              </Button>
            </Link>
          </DarkMode>
        </Container>
      </Box>

      <Container
        as="main"
        maxW="container.lg"
        py={{ base: 16, md: 24 }}
        textAlign="center"
      >
        <Heading size="lg" mb={4}>
          Discovery tools
        </Heading>
        <Text fontSize="lg" opacity="0.8">
          Search for gear or packs created by other hikers and easily add their
          gear to your own inventory or wish list.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mt={12}>
          <IconCard
            icon={FcBinoculars}
            title="Gear search"
            text={
              <>
                The hikerherd gear search is crowd-sourced by{" "}
                <strong>you</strong>, so the more gear you add the better it
                gets.
              </>
            }
          />

          <IconCard
            icon={FcSearch}
            title="Pack search"
            text="Search for packs made by other hikers to see what they are taking on the trails you want to hike next."
          />
        </SimpleGrid>
      </Container>

      <Box bg={useColorModeValue("gray.50", "gray.800")}>
        <Container
          as="main"
          maxW="container.lg"
          py={{ base: 16, md: 24 }}
          textAlign="center"
        >
          <Heading size="lg" mb={4}>
            Ready to get started?
          </Heading>
          <Text fontSize="lg" opacity="0.8">
            Signing up is <strong>free</strong>. You&apos;ll have an ultralight
            pack in no time!
          </Text>

          <Link href={Routes.SignupPage()} passHref>
            <Button
              mt={8}
              size="lg"
              as="a"
              rightIcon={<FaArrowRight />}
              colorScheme="blue"
            >
              Sign up to hikerherd
            </Button>
          </Link>
        </Container>
      </Box>
    </Fragment>
  );
};

HomePage.redirectAuthenticatedTo = Routes.StartPage();

HomePage.getLayout = (page) => <PlainLayout>{page}</PlainLayout>;

export default HomePage;
