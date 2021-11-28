import type { Comment as PrismaComment } from "db";

import React, { useMemo, useState } from "react";

import { Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";

import { generateHTML } from "@tiptap/react";

import getEditorExtensions from "app/core/helpers/get-editor-extensions";

import EditorHtml from "app/core/components/editor-html";

import useComments from "../hooks/use-comments";

import CommentsProvider from "./comments-provider";
import CommentForm from "./comment-form";
import CommentList from "./comment-list";

type CommentProps = {
  comment: PrismaComment;
  added?: boolean;
};

const Comment: React.FC<CommentProps> = ({ comment, added }) => {
  const [showForm, setShowForm] = useState(false);
  const { parentPostId, depth } = useComments();

  const html = useMemo(() => {
    try {
      return generateHTML(JSON.parse(comment.content), getEditorExtensions());
    } catch (error) {
      return "<p>There was an error rendering this comment</p>";
    }
  }, [comment.content]);

  return (
    <Box key={comment.id} bg={added ? "yellow" : ""}>
      <EditorHtml dangerouslySetInnerHTML={{ __html: html }} />

      {!showForm && <Button onClick={() => setShowForm(true)}>Reply</Button>}

      <Box ml={4}>
        <CommentsProvider
          parentPostId={parentPostId}
          parentCommentId={comment.id}
          depth={depth + 1}
        >
          {showForm && <CommentForm onSuccess={() => setShowForm(false)} />}

          <CommentList />
        </CommentsProvider>
      </Box>
    </Box>
  );
};

export default Comment;
