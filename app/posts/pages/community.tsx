import type { BlitzPage } from "blitz";

import { Link, Routes, usePaginatedQuery } from "blitz";
import { useState } from "react";

import { Button } from "@chakra-ui/button";

import ThreeColumnLayout from "app/common/layouts/three-column-layout";
import latestPostsQuery from "app/posts/queries/latest-posts-query";
import PostList from "app/posts/components/post-list";

const PostsPage: BlitzPage = () => {
  const [page] = useState(1);

  const [posts] = usePaginatedQuery(latestPostsQuery, {
    skip: 10 * (page - 1),
    take: 10,
  });

  return (
    <>
      <Link href={Routes.NewPostPage()} passHref>
        <Button as="a">Make a post</Button>
      </Link>
      <PostList posts={posts.items} />
    </>
  );
};

PostsPage.getLayout = (page) => (
  <ThreeColumnLayout title="Community">{page}</ThreeColumnLayout>
);

export default PostsPage;
