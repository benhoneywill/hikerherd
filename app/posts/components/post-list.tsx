import type { FC } from "react";
import type { LatestPostsResultItem } from "../queries/latest-posts-query";

import { Link, Routes } from "blitz";

import { HStack, Stack, Text, Box, Heading } from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";

import timeSince from "app/core/helpers/time-since";

type PostListProps = {
  posts: LatestPostsResultItem[];
};

const PostList: FC<PostListProps> = ({ posts }) => {
  return (
    <Stack as="ul" listStyleType="none">
      {posts.map((post) => (
        <li key={post.id}>
          <HStack spacing={4}>
            <Avatar size="sm" src={post.author.avatar || ""} />
            <div>
              <Text>{post.author.username}</Text>
              <Text>{timeSince(post.createdAt)}</Text>
            </div>
          </HStack>

          <Box ml={12}>
            <Heading size="lg">
              <Link href={Routes.PostPage({ slug: post.slug })} passHref>
                <a>{post.title}</a>
              </Link>
            </Heading>
          </Box>
        </li>
      ))}
    </Stack>
  );
};

export default PostList;
