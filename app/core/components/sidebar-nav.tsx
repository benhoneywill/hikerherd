import type { FC } from "react";

import { Link, Routes } from "blitz";

import { Heading, Stack, Link as Anchor } from "@chakra-ui/layout";

const SidebarNav: FC = () => {
  return (
    <Stack as="aside" spacing={6}>
      <Stack as="nav">
        <Link href={Routes.HomePage()} passHref>
          <Anchor>Feed</Anchor>
        </Link>
        <Link href={Routes.PostsPage()} passHref>
          <Anchor>Community</Anchor>
        </Link>
        <Link href={Routes.BlogsPage()} passHref>
          <Anchor>Hiker Blogs</Anchor>
        </Link>
        <Link href={Routes.ShakedownsPage()} passHref>
          <Anchor>Shakedowns</Anchor>
        </Link>
      </Stack>

      <Stack as="nav">
        <Heading size="sm">Tools</Heading>

        <Link href="#" passHref>
          <Anchor>Gear Closet</Anchor>
        </Link>
        <Link href="#" passHref>
          <Anchor>Gear Planner</Anchor>
        </Link>
      </Stack>

      <Stack as="nav">
        <Heading size="sm">Other</Heading>

        <Link href="#" passHref>
          <Anchor>Code of Conduct</Anchor>
        </Link>
      </Stack>
    </Stack>
  );
};

export default SidebarNav;
