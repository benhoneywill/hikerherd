import type { BlitzPage } from "blitz";
import type { MyBlogPostsResultItem } from "app/blogs/queries/my-blog-posts-query";

import { useMutation, useRouter, Link, Routes, usePaginatedQuery } from "blitz";
import { useState } from "react";

import { Button } from "@chakra-ui/button";
import { Badge } from "@chakra-ui/layout";

import SingleColumnLayout from "app/common/layouts/single-column-layout";
import myBlogPostsQuery from "app/blogs/queries/my-blog-posts-query";
import publishBlogPostMutation from "app/blogs/mutations/publish-blog-post-mutation";

const PostItem = ({ post }: { post: MyBlogPostsResultItem }) => {
  const router = useRouter();

  const [publishPost] = useMutation(publishBlogPostMutation);

  const publish = async () => {
    await publishPost({
      id: post.id,
    });

    router.push(
      Routes.BlogPostPage({
        slug: router.query.slug as string,
        postSlug: post.slug,
      })
    );
  };

  return (
    <div>
      <Link
        href={Routes.EditBlogPostPage({
          slug: router.query.slug as string,
          postSlug: post.slug,
        })}
      >
        <a>
          {post.title} <Badge>{post.publishedAt ? "published" : "draft"}</Badge>
        </a>
      </Link>

      {!post.publishedAt && <Button onClick={publish}>Publish</Button>}
    </div>
  );
};

const MyBlogPage: BlitzPage = () => {
  const router = useRouter();
  const [page] = useState(1);

  const [posts] = usePaginatedQuery(myBlogPostsQuery, {
    slug: router.query.slug as string,
    skip: 10 * (page - 1),
    take: 10,
  });

  return (
    <>
      <h1>My blog</h1>

      <Link
        href={Routes.NewBlogPostPage({ slug: router.query.slug as string })}
        passHref
      >
        <Button as="a">New blog post</Button>
      </Link>
      {posts.items.map((post) => (
        <PostItem key={post.slug} post={post} />
      ))}
    </>
  );
};

MyBlogPage.getLayout = (page) => (
  <SingleColumnLayout title="My blog">{page}</SingleColumnLayout>
);

export default MyBlogPage;
