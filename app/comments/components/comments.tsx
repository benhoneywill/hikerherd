import React from "react";

import CommentsProvider from "./comments-provider";
import CommentForm from "./comment-form";
import CommentList from "./comment-list";

type CommentsProps = {
  parentPostId: number;
};

const Comments: React.FC<CommentsProps> = ({ parentPostId }) => {
  return (
    <CommentsProvider parentPostId={parentPostId} depth={0}>
      <CommentForm />
      <CommentList />
    </CommentsProvider>
  );
};

export default Comments;
