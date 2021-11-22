import type { FC } from "react";
import type { Post } from "db";
import type { CreatePostValues } from "../schemas/create-post-schema";
import type { CreatePostResult } from "../mutations/create-post-mutation";
import type { UpdatePostResult } from "../mutations/update-post-mutation";

import { useMutation } from "blitz";

import TextField from "app/core/components/text-field";
import Form, { FORM_ERROR } from "app/core/components/form";
import Tiptap from "app/core/components/tiptap";

import createPostMutation from "../mutations/create-post-mutation";
import createPostSchema from "../schemas/create-post-schema";
import updatePostMutation from "../mutations/update-post-mutation";

type PostFormProps = {
  post?: Pick<Post, "id" | "title" | "content" | "publishedAt">;
  onSuccess?: (post: CreatePostResult | UpdatePostResult) => void;
};

const PostForm: FC<PostFormProps> = ({ post, onSuccess }) => {
  const [createPost] = useMutation(createPostMutation);
  const [updatePost] = useMutation(updatePostMutation);

  const initialValues = {
    title: post ? post.title : "",
    content: post ? JSON.parse(post.content) : "",
  };

  const handleSubmit = async (values: CreatePostValues) => {
    try {
      let result;

      if (post) {
        result = await updatePost({ id: post.id, ...values });
      } else {
        result = await createPost(values);
      }

      if (onSuccess) onSuccess(result);
    } catch (error: unknown) {
      return {
        [FORM_ERROR]: "Sorry, there was an unexpected error. Please try again.",
      };
    }
  };

  return (
    <Form
      submitText="Post"
      schema={createPostSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <TextField name="title" label="Title" placeholder="Title" />
      <Tiptap name="content" />
    </Form>
  );
};

export default PostForm;
