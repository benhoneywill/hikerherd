import type { Post } from "db";
import type { BlitzPage, GetServerSideProps } from "blitz";

import { invokeWithMiddleware, NotFoundError } from "blitz";
import { useMemo } from "react";

import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { generateHTML } from "@tiptap/react";

import Layout from "app/core/layouts/layout";
import { StyledTiptapContent } from "app/core/components/tiptap";

import publicPostQuery from "../../queries/public-post-query";

type PostPage = {
  post: Post;
};

const PostPage: BlitzPage<PostPage> = ({ post }) => {
  const html = useMemo(() => {
    try {
      return generateHTML(JSON.parse(post.content), [StarterKit, Image]);
    } catch {
      return "<p>There was an error rendering this post</p>";
    }
  }, [post.content]);

  return (
    <div>
      <h1>{post.title}</h1>
      <StyledTiptapContent dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  try {
    const post = await invokeWithMiddleware(
      publicPostQuery,
      { slug: params?.slug as string },
      { req, res }
    );

    return { props: { post } };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { notFound: true };
    } else {
      throw error;
    }
  }
};

PostPage.getLayout = (page) => <Layout title="Post">{page}</Layout>;

export default PostPage;
