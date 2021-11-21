import type { FC } from "react";
import type { PromiseReturnType } from "blitz";

import { useMutation } from "blitz";

import { TextField } from "app/core/components/text-field";
import { Form, FORM_ERROR } from "app/core/components/form";
import { Tiptap } from "app/core/components/tiptap";

import createPostMutation from "../mutations/create-post-mutation";
import { CreatePostSchema } from "../schemas/create-post-schema";
import updatePostMutation from "../mutations/update-post-mutation";

type PostFormProps = {
  post?: { id: number; title: string; content: string | null; publishedAt: Date | null };
  onSuccess?: (
    post: PromiseReturnType<typeof createPostMutation | typeof updatePostMutation>
  ) => void;
};

export const PostForm: FC<PostFormProps> = ({ post, onSuccess }) => {
  const [createPost] = useMutation(createPostMutation);
  const [updatePost] = useMutation(updatePostMutation);

  const initialValues = {
    title: post?.title || "",
    content: post?.content ? JSON.parse(post.content) : "",
    publish: !!post?.publishedAt || false,
  };

  return (
    <Form
      submitText="Post"
      schema={CreatePostSchema}
      initialValues={initialValues}
      onSubmit={async (values) => {
        try {
          let result;
          if (post) {
            result = await updatePost({ id: post.id, ...values });
          } else {
            result = await createPost(values);
          }
          if (onSuccess) onSuccess(result);
        } catch (error: any) {
          return {
            [FORM_ERROR]: "Sorry, there was an unexpected error. Please try again.",
          };
        }
      }}
    >
      <TextField name="title" label="Title" placeholder="Title" />
      <Tiptap name="content" />
    </Form>
  );
};
