import type { BlitzPage, GetServerSideProps } from "blitz";

import { NotFoundError } from "blitz";
import { useParam } from "blitz";
import { useQuery } from "blitz";

import SingleColumnLayout from "app/core/layouts/single-column-layout";
import EditorHtml from "app/editor/components/editor-html";
import PrefetchQueryClient from "app/core/helpers/prefetch-query-client";
import Comments from "app/comments/components/comments";
import useEditorHtml from "app/editor/hooks/use-editor-html";
import commentsQuery from "app/comments/queries/comments-query";

import { CommentRootType } from "db";

import publicPostQuery from "../../../queries/public-post-query";

const PostPage: BlitzPage = () => {
  const slug = useParam("slug") as string;
  const [post] = useQuery(publicPostQuery, { slug });

  const html = useEditorHtml(post.content, {
    image: true,
    blockquote: true,
    heading: true,
    horizontalRule: true,
  });

  return (
    <div>
      <h1>{post.title}</h1>
      <EditorHtml fontSize="lg" dangerouslySetInnerHTML={{ __html: html }} />
      <Comments rootId={post.id} rootType={CommentRootType.POST} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const client = new PrefetchQueryClient(ctx);

  try {
    const slug = ctx.params?.slug as string;
    const post = await client.prefetchQuery(publicPostQuery, { slug });
    await client.prefetchInfiniteQuery(commentsQuery, {
      rootId: post.id,
      rootType: CommentRootType.POST,
      depth: 4,
    });
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

PostPage.getLayout = (page) => <SingleColumnLayout title="Post">{page}</SingleColumnLayout>;

export default PostPage;
