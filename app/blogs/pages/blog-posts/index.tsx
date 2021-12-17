import type { BlitzPage } from "blitz";

import { usePaginatedQuery } from "blitz";
import { useState } from "react";

import ThreeColumnLayout from "app/common/layouts/three-column-layout";

import BlogPostList from "../../components/blog-post-list";
import latestBlogPostsQuery from "../../queries/latest-blog-posts-query";

const BlogPostsPage: BlitzPage = () => {
  const [page] = useState(1);

  const [posts] = usePaginatedQuery(latestBlogPostsQuery, {
    skip: 10 * (page - 1),
    take: 10,
  });

  return <BlogPostList posts={posts.items} />;
};

BlogPostsPage.getLayout = (page) => (
  <ThreeColumnLayout title="Community">{page}</ThreeColumnLayout>
);

export default BlogPostsPage;
