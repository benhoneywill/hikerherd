import type { BlitzPage } from "blitz";

import { Link, Routes, usePaginatedQuery } from "blitz";
import { useState } from "react";

import { Button } from "@chakra-ui/button";

import Layout from "app/core/layouts/layout";
import latestPostsQuery from "app/posts/queries/latest-posts-query";
import PostList from "app/posts/components/post-list";

const HomePage: BlitzPage = () => {
  const [page] = useState(1);

  const [posts] = usePaginatedQuery(latestPostsQuery, {
    skip: 10 * (page - 1),
    take: 10,
  });

  return (
    <>
      <h1>Home</h1>
      <Link href={Routes.NewPostPage()} passHref>
        <Button as="a">New post</Button>
      </Link>
      <PostList posts={posts.items} />
    </>
  );
};

HomePage.getLayout = (page) => <Layout title="Home">{page}</Layout>;

export default HomePage;
