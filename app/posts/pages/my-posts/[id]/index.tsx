import type { BlitzPage } from "blitz";

import { useQuery, useRouterQuery } from "blitz";
import { useMemo } from "react";

import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { generateHTML } from "@tiptap/react";

import Layout from "app/core/layouts/layout";
import { StyledTiptapContent } from "app/core/components/tiptap";

import myPostQuery from "../../../queries/my-post-query";

const MyPostPage: BlitzPage = () => {
  const query = useRouterQuery();
  const [post] = useQuery(myPostQuery, { id: Number(query.id as string) });

  const html = useMemo(() => {
    try {
      return generateHTML(JSON.parse(post.content), [StarterKit, Image]);
    } catch {
      return "<p>There was an error rendering your post</p>";
    }
  }, [post.content]);

  return (
    <div>
      <h1>{post.title}</h1>
      <StyledTiptapContent dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

MyPostPage.getLayout = (page) => <Layout>{page}</Layout>;

export default MyPostPage;
