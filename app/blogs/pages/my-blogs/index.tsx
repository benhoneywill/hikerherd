import type { BlitzPage } from "blitz";

import { Link, Routes, usePaginatedQuery } from "blitz";
import { useState } from "react";

import { Button } from "@chakra-ui/button";
import { Badge } from "@chakra-ui/layout";

import SingleColumnLayout from "app/common/layouts/single-column-layout";
import myBlogsQuery from "app/blogs/queries/my-blogs-query";

const MyBlogsPage: BlitzPage = () => {
  const [page] = useState(1);

  const [blogs] = usePaginatedQuery(myBlogsQuery, {
    skip: 10 * (page - 1),
    take: 10,
  });

  return (
    <>
      <h1>My blogs</h1>
      <Link href={Routes.NewBlogPage()} passHref>
        <Button as="a">Start a new blog</Button>
      </Link>
      {blogs.items.map((blog) => (
        <div key={blog.slug}>
          <Link href={Routes.MyBlogPage({ slug: blog.slug })}>
            <a>
              {blog.name} <Badge>{blog.role}</Badge>
            </a>
          </Link>
        </div>
      ))}
    </>
  );
};

MyBlogsPage.getLayout = (page) => (
  <SingleColumnLayout title="My blogs">{page}</SingleColumnLayout>
);

export default MyBlogsPage;
