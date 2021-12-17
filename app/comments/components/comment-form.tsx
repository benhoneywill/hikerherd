import type { CommentsResultItem } from "../queries/comments-query";
import type { editorContentValues } from "app/common/modules/editor/schemas/editor-content-schema";
import type { CreateCommentResult } from "../mutations/create-comment-mutation";
import type { UpdateCommentResult } from "../mutations/update-comment-mutation";
import type { FC } from "react";

import { useSession, useMutation, Routes } from "blitz";

import Link from "next/link";
import { Button } from "@chakra-ui/button";

import EditorField from "app/common/modules/editor/components/editor-field";
import Form from "app/common/components/form";

import createCommentMutation from "../mutations/create-comment-mutation";
import createCommentSchema from "../schemas/create-comment-schema";
import useComments from "../hooks/use-comments";
import updateCommentMutation from "../mutations/update-comment-mutation";

type CommentFormProps = {
  comment?: CommentsResultItem;
  onSuccess?: (comment: CreateCommentResult | UpdateCommentResult) => void;
  onClose: () => void;
};

const CommentForm: FC<CommentFormProps> = ({ comment, onSuccess, onClose }) => {
  const { userId } = useSession();
  const { rootId, rootType, parentId } = useComments();

  const [createComment] = useMutation(createCommentMutation);
  const [updateComment] = useMutation(updateCommentMutation);

  const initialValues = { content: comment ? JSON.parse(comment.content) : "" };

  const handleSubmit = async (data: { content: editorContentValues }) => {
    let result: CreateCommentResult | UpdateCommentResult;

    if (comment) {
      result = await updateComment({ id: comment.id, ...data });
    } else {
      result = await createComment({ rootId, rootType, parentId, ...data });
    }

    if (onSuccess) onSuccess(result);

    onClose();
  };

  if (!userId) {
    return <Link href={Routes.LoginPage()}>Log in to comment</Link>;
  }

  return (
    <Form
      submitText="Comment"
      schema={createCommentSchema.pick({ content: true })}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      renderButtons={() => (
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
      )}
    >
      <EditorField name="content" autofocus barMenu />
    </Form>
  );
};

export default CommentForm;
