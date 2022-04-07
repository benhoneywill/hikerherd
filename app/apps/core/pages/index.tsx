import type { BlitzPage, RouteUrlObject } from "blitz";
import type { IconType } from "react-icons";
import type { FC } from "react";

import { useQuery, Link, Routes } from "blitz";
import { Fragment } from "react";

import {
  Heading,
  Box,
  Container,
  SimpleGrid,
  Text,
  Link as Anchor,
} from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Icon } from "@chakra-ui/icon";
import { Tag, TagLeftIcon, TagLabel } from "@chakra-ui/tag";
import { Image } from "@chakra-ui/image";
import { DarkMode, useColorModeValue } from "@chakra-ui/react";
import { FaUser, FaArrowRight } from "react-icons/fa";
import {
  FcBinoculars,
  FcList,
  FcRating,
  FcSearch,
  FcTimeline,
} from "react-icons/fc";

import PlainLayout from "app/layouts/plain-layout";

import userCountQuery from "../queries/user-count-query";

type IconCardProps = {
  icon: IconType;
  title: string;
  text: string | JSX.Element;
  actionLink?: RouteUrlObject;
  actionText?: string;
};

const IconCard: FC<IconCardProps> = ({
  icon,
  title,
  text,
  actionLink,
  actionText,
}) => {
  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      p={5}
      borderRadius="md"
      textAlign="center"
    >
      <Icon as={icon} w={8} h={8} mb={2} />
      <Heading size="md" mb={2}>
        {title}
      </Heading>
      <Text opacity="0.8">{text}</Text>

      {actionLink && actionText && (
        <Link href={actionLink} passHref>
          <Button isFullWidth as="a" mt={5}>
            {actionText}
          </Button>
        </Link>
      )}
    </Box>
  );
};

const HomePage: BlitzPage = () => {
  const [userCount] = useQuery(userCountQuery, {}, { suspense: false });

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
            Join the other hikers, backpackers & minimalists who are already
            using <strong>hikerherd</strong> to manage their gear and plan their
            adventures.
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
          Organizing your gear closet and planning packing lists has never been
          so easy.
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
            text="Track any gear you want to buy complete with links, prices and more."
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
          maxW="container.md"
          py={{ base: 16, md: 24 }}
          textAlign="center"
        >
          <Heading size="lg" mb={4}>
            Pack weight analytics
          </Heading>
          <Text fontSize="lg" opacity="0.8">
            The first step towards an ultralight pack is knowing where your
            weight is coming from - <strong>hikerherd</strong> helps you decide
            what to take on your trip and what to leave at home.
          </Text>

          <Image
            mx="auto"
            my={12}
            alt="Screenshot of piechart and table"
            borderRadius="md"
            w="100%"
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
        <Text fontSize="lg" opacity="0.8" maxW="container.md" mx="auto">
          Need some inspiration? Search for packs and gear created by other
          users and easily copy their gear into your own inventory or lists.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mt={12}>
          <IconCard
            icon={FcBinoculars}
            title="Gear search"
            actionLink={Routes.DiscoverGearPage()}
            actionText="Search for gear"
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
            actionLink={Routes.DiscoverPacksPage()}
            actionText="Search for packs"
            text="Search for packs made by other hikers to see what they are taking on the trails you want to hike next."
          />
        </SimpleGrid>
      </Container>

      <Box bg={useColorModeValue("gray.50", "gray.800")}>
        <Container
          as="main"
          maxW="container.sm"
          py={{ base: 16, md: 24 }}
          textAlign="center"
        >
          <Heading size="lg" mb={4}>
            Ready to get started?
          </Heading>
          <Text fontSize="lg" opacity="0.8">
            Join the{" "}
            <Tag my="2px" fontWeight="bold" colorScheme="teal">
              <TagLeftIcon boxSize="12px" as={FaUser} />
              <TagLabel>{userCount ? userCount : "..."}</TagLabel>
            </Tag>{" "}
            other hikers who are already using <strong>hikerherd</strong> to
            manage their gear and reduce their pack weight.
          </Text>

          <Link href={Routes.SignupPage()} passHref>
            <Button
              mt={8}
              size="lg"
              as="a"
              rightIcon={<FaArrowRight />}
              colorScheme="blue"
            >
              Sign up now
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
