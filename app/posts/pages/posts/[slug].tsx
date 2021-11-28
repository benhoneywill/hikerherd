import type { BlitzPage, GetServerSideProps } from "blitz";

import { NotFoundError } from "blitz";

import { useParam } from "blitz";

import { useQuery } from "blitz";
import { useMemo } from "react";

import { generateHTML } from "@tiptap/html";

import Layout from "app/core/layouts/layout";
import EditorHtml from "app/core/components/editor-html";
import PrefetchQueryClient from "app/core/helpers/prefetch-query-client";

import getEditorExtensions from "app/core/helpers/get-editor-extensions";

import Comments from "app/comments/components/comments";

import publicPostQuery from "../../queries/public-post-query";

const PostPage: BlitzPage = () => {
  const slug = useParam("slug") as string;
  const [post] = useQuery(publicPostQuery, { slug });

  const html = useMemo(() => {
    try {
      return generateHTML(
        JSON.parse(post.content),
        getEditorExtensions({ image: true, blockquote: true, heading: true, horizontalRule: true })
      );
    } catch (error) {
      return "<p>There was an error rendering this post</p>";
    }
  }, [post.content]);

  return (
    <div>
      <h1>{post.title}</h1>
      <EditorHtml fontSize="lg" dangerouslySetInnerHTML={{ __html: html }} />
      <Comments parentPostId={post.id} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const client = new PrefetchQueryClient(ctx);

  try {
    const slug = ctx.params?.slug as string;
    await client.prefetchQuery(publicPostQuery, { slug });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { notFound: true };
    } else {
      throw error;
    }
  }

  return {
    props: {
      dehydratedState: client.dehydrate(),
    },
  };
};

PostPage.getLayout = (page) => <Layout title="Post">{page}</Layout>;

export default PostPage;
