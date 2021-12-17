import type { CommentRootType } from "db";
import type { FC } from "react";

import { useState } from "react";

import { Button } from "@chakra-ui/button";

import useComments from "../hooks/use-comments";

import CommentsProvider from "./comments-provider";
import CommentForm from "./comment-form";
import CommentList from "./comment-list";

type CommentsProps = {
  rootId: string;
  rootType: CommentRootType;
};

const CommentsRoot: FC = () => {
  const [showForm, setShowForm] = useState(false);
  const { addComment } = useComments();

  return (
    <div>
      {showForm ? (
        <CommentForm
          onClose={() => setShowForm(false)}
          onSuccess={addComment}
        />
      ) : (
        <Button onClick={() => setShowForm(true)}>Leave a comment</Button>
      )}

      <CommentList />
    </div>
  );
};

const Comments: FC<CommentsProps> = ({ rootId, rootType }) => {
  return (
    <CommentsProvider rootId={rootId} rootType={rootType}>
      <CommentsRoot />
    </CommentsProvider>
  );
};

export default Comments;
