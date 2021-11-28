import type { Comment } from "db";
import type { CreateCommentValues } from "../schemas/create-comment-schema";

import React from "react";
import { useSession, useMutation, Routes } from "blitz";

import Link from "next/link";

import EditorField from "app/core/components/editor-field";
import Form from "app/core/components/form";

import createCommentMutation from "../mutations/create-comment-mutation";
import createCommentSchema from "../schemas/create-comment-schema";
import useComments from "../hooks/use-comments";

type CommentFormProps = {
  onSuccess?: (comment: Comment) => void;
};

const CommentForm: React.FC<CommentFormProps> = ({ onSuccess }) => {
  const { userId } = useSession();
  const { parentPostId, parentCommentId, addComment } = useComments();
  const [createComment] = useMutation(createCommentMutation);

  const initialValues = { content: "", parentPostId, parentCommentId };

  const handleSubmit = async (data: CreateCommentValues) => {
    if (!parentPostId) return;

    const comment = await createComment(data);
    addComment(comment);

    if (onSuccess) onSuccess(comment);
  };

  if (!userId) {
    return <Link href={Routes.LoginPage()}>Log in to comment</Link>;
  }

  return (
    <Form
      submitText="Comment"
      schema={createCommentSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <EditorField name="content" />
    </Form>
  );
};

export default CommentForm;
