import type { BlitzPage } from "blitz";

import { useQuery, useParam } from "blitz";
import { useMemo } from "react";

import { generateHTML } from "@tiptap/react";

import EditorHtml from "app/core/components/editor-html";
import getEditorExtensions from "app/core/helpers/get-editor-extensions";
import Layout from "app/core/layouts/layout";

import myPostQuery from "../../../queries/my-post-query";

const MyPostPage: BlitzPage = () => {
  const id = useParam("id") as string;
  const [post] = useQuery(myPostQuery, { id: Number(id) });

  const html = useMemo(() => {
    try {
      return generateHTML(
        JSON.parse(post.content),
        getEditorExtensions({ image: true, blockquote: true, heading: true, horizontalRule: true })
      );
    } catch {
      return "<p>There was an error rendering your post</p>";
    }
  }, [post.content]);

  return (
    <div>
      <h1>{post.title}</h1>
      <EditorHtml fontSize="xl" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

MyPostPage.getLayout = (page) => <Layout>{page}</Layout>;

export default MyPostPage;
