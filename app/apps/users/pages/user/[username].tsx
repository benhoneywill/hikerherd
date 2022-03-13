import type { BlitzPage, GetServerSideProps } from "blitz";

import { useQuery, useRouter, NotFoundError } from "blitz";
import { Fragment } from "react";

import { Container, Box, Heading, Stack, SimpleGrid } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { useColorModeValue } from "@chakra-ui/react";

import PrefetchQueryClient from "app/helpers/prefetch-query-client";
import PlainLayout from "app/layouts/plain-layout";
import PackCard from "app/apps/packs/components/pack-card";

import userQuery from "../../queries/user-query";

const ProfilePage: BlitzPage = () => {
  const router = useRouter();
  const [user] = useQuery(userQuery, {
    username: router.query.username as string,
  });

  return (
    <Fragment>
      <Box bg={useColorModeValue("gray.200", "gray.800")} py={6}>
        <Container as="main" maxW="container.lg" py={{ base: 5, md: 10 }}>
          <Stack align="center" spacing={6}>
            <Avatar size="2xl" src={user?.avatar || ""} />
            <Heading size="2xl">{user.username}</Heading>
          </Stack>
        </Container>
      </Box>

      <Container as="main" maxW="container.lg" py={{ base: 5, md: 10 }}>
        <Heading size="lg" mb={8}>
          Packs
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mt={2}>
          {user.packs.map((pack) => (
            <PackCard key={pack.id} pack={pack} shareLink />
          ))}
        </SimpleGrid>
      </Container>
    </Fragment>
  );
};

ProfilePage.getLayout = (page) => <PlainLayout>{page}</PlainLayout>;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const client = new PrefetchQueryClient(ctx);

  try {
    const username = ctx.params?.username as string;
    await client.prefetchQuery(userQuery, { username });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { notFound: true };
    } else {
      throw error;
    }
  }

  return {
    props: {
      dehydratedState: client.dehydrate(),
    },
  };
};

export default ProfilePage;
