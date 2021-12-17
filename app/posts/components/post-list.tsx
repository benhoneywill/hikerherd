import type { FC } from "react";
import type { LatestPostsResultItem } from "../queries/latest-posts-query";

import { Link, Routes } from "blitz";

import {
  HStack,
  Stack,
  Text,
  Heading,
  Link as Anchor,
  Box,
} from "@chakra-ui/layout";
import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";

import timeSince from "app/common/helpers/time-since";
import pluralize from "app/common/helpers/pluralize";
import useEditorHtml from "app/common/modules/editor/hooks/use-editor-html";
import EditorSnippetHtml from "app/common/modules/editor/components/editor-snippet-html";

type PostListProps = {
  posts: LatestPostsResultItem[];
};

const Post = ({ post }) => {
  const html = useEditorHtml(
    post.content,
    {
      image: true,
      blockquote: true,
      heading: true,
      horizontalRule: true,
    },
    { snippet: true }
  );

  return (
    <li>
      <HStack spacing={4}>
        <Avatar size="sm" src={post.author.avatar || ""} />
        <div>
          <Text mb={-1}>{post.author.username}</Text>
          <Text fontSize="xs" color="gray.500">
            {timeSince(post.createdAt)}
          </Text>
        </div>
      </HStack>

      <Stack spacing={3} ml={12} mt={3}>
        <Heading size="md">
          <Link href={Routes.PostPage({ slug: post.slug })} passHref>
            <Anchor>{post.title}</Anchor>
          </Link>
        </Heading>

        <Box
          position="relative"
          maxHeight="140px"
          overflow="hidden"
          bg="gray.700"
          borderRadius="sm"
          p={3}
        >
          <EditorSnippetHtml
            fontSize="sm"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <Box
            position="absolute"
            top="0"
            height="140px"
            zIndex={2}
            bottom="0"
            width="100%"
            bgGradient="linear(to-b, transparent 40px, gray.700 130px)"
          />
        </Box>

        <HStack spacing={2}>
          <Button size="xs">{pluralize(post.commentCount, "comment")}</Button>
        </HStack>
      </Stack>
    </li>
  );
};

const PostList: FC<PostListProps> = ({ posts }) => {
  return (
    <Stack as="ul" listStyleType="none" spacing={4}>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </Stack>
  );
};

export default PostList;
