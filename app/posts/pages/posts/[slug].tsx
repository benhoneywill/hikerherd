import type { Post } from "db";
import type { BlitzPage, GetServerSideProps } from "blitz";

import { invokeWithMiddleware, NotFoundError } from "blitz";
import { useMemo } from "react";

import StarterKit from "@tiptap/starter-kit";
import { generateHTML } from "@tiptap/react";

import { Layout } from "app/core/layouts/layout";

import postBySlugQuery from "../../queries/post-by-slug-query";

type PostPage = {
  post: Post;
};

const PostPage: BlitzPage<PostPage> = ({ post }) => {
  const jsonContent = useMemo(() => JSON.parse(post.content || "{}"), [post.content]);

  const htmlContent = useMemo(() => {
    return generateHTML(jsonContent, [StarterKit]);
  }, [jsonContent]);

  return (
    <div>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  try {
    const post = await invokeWithMiddleware(
      postBySlugQuery,
      { slug: params?.slug as string },
      { req, res }
    );

    return { props: { post } };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return {
        notFound: true,
      };
    } else {
      throw error;
    }
  }
};

PostPage.getLayout = (page) => <Layout title="Post">{page}</Layout>;

export default PostPage;
