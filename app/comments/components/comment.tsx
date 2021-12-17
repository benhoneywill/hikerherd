import type { CommentsResultItem } from "../queries/comments-query";
import type { FC } from "react";

import { useSession } from "blitz";
import { useState } from "react";

import { Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";

import EditorHtml from "app/common/modules/editor/components/editor-html";
import useEditorHtml from "app/common/modules/editor/hooks/use-editor-html";

import useComments from "../hooks/use-comments";

import CommentReplies from "./comment-replies";
import CommentForm from "./comment-form";

type CommentProps = {
  comment: CommentsResultItem;
  added?: boolean;
};

const Comment: FC<CommentProps> = ({ comment, added }) => {
  const [edit, setEdit] = useState(false);
  const { userId } = useSession();
  const { updateComment } = useComments();
  const html = useEditorHtml(comment.content);

  const canEdit = userId === comment.authorId;

  return (
    <div>
      <Box key={comment.id} bg={added ? "yellow" : ""}>
        {edit ? (
          <CommentForm
            comment={comment}
            onClose={() => setEdit(false)}
            onSuccess={updateComment}
          />
        ) : (
          <EditorHtml dangerouslySetInnerHTML={{ __html: html }} />
        )}

        {canEdit && !edit && (
          <Button onClick={() => setEdit(true)}>Edit</Button>
        )}
      </Box>

      <CommentReplies comment={comment} />
    </div>
  );
};

export default Comment;
