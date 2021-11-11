import type { Post } from "db";
import type { BlitzPage, GetServerSideProps } from "blitz";

import { invokeWithMiddleware } from "blitz";

import { Layout } from "app/core/layouts/layout";

import postBySlugQuery from "../../queries/post-by-slug-query";

type PostPage = {
  post: Post;
};

const PostPage: BlitzPage<PostPage> = ({ post }) => {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const post = await invokeWithMiddleware(
    postBySlugQuery,
    { slug: params?.slug as string },
    { req, res }
  );

  if (!post) {
    return {
      notFound: true,
    };
  }

  return { props: { post } };
};

PostPage.getLayout = (page) => <Layout title="Post">{page}</Layout>;

export default PostPage;
