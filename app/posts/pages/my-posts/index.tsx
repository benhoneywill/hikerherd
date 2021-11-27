import type { BlitzPage } from "blitz";

import { Link, Routes, usePaginatedQuery } from "blitz";
import { useState } from "react";

import { Button } from "@chakra-ui/button";

import Layout from "app/core/layouts/layout";
import myPostsQuery from "app/posts/queries/my-posts-query";
import MyPostsList from "app/posts/components/my-posts-list";

const MyPostsPage: BlitzPage = () => {
  const [page] = useState(1);

  const [posts] = usePaginatedQuery(myPostsQuery, {
    skip: 10 * (page - 1),
    take: 10,
  });

  return (
    <>
      <h1>My posts</h1>
      <Link href={Routes.NewPostPage()} passHref>
        <Button as="a">New post</Button>
      </Link>
      <MyPostsList posts={posts.items} />
    </>
  );
};

MyPostsPage.authenticate = { redirectTo: Routes.LoginPage() };
MyPostsPage.getLayout = (page) => <Layout title="My Posts">{page}</Layout>;

export default MyPostsPage;
