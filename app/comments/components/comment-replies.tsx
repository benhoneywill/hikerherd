import type { CommentsResultItem } from "../queries/comments-query";

import React, { useState } from "react";

import { Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";

import useComments from "../hooks/use-comments";

import CommentsProvider from "./comments-provider";
import CommentForm from "./comment-form";
import CommentList from "./comment-list";

type CommentProps = {
  comment: CommentsResultItem;
};

const CommentReplyForm = ({ onClose }: { onClose: () => void }) => {
  const { addComment } = useComments();
  return <CommentForm onClose={onClose} onSuccess={addComment} />;
};

const CommentReplies: React.FC<CommentProps> = ({ comment }) => {
  const [showForm, setShowForm] = useState(false);
  const { rootId, rootType } = useComments();

  return (
    <CommentsProvider
      rootId={rootId}
      rootType={rootType}
      parentId={comment.id}
      initialComments={comment.replies}
      commentCount={comment._count?.replies}
    >
      {showForm ? (
        <CommentReplyForm onClose={() => setShowForm(false)} />
      ) : (
        <Button onClick={() => setShowForm(true)}>Reply</Button>
      )}

      <Box ml={4}>
        <CommentList />
      </Box>
    </CommentsProvider>
  );
};

export default CommentReplies;
