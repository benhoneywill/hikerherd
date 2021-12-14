import type { FC } from "react";
import type { Post } from "db";
import type { CreatePostValues } from "../schemas/create-post-schema";
import type { CreatePostResult } from "../mutations/create-post-mutation";
import type { UpdatePostResult } from "../mutations/update-post-mutation";

import { useMutation } from "blitz";

import { Stack } from "@chakra-ui/layout";

import TextField from "app/core/components/text-field";
import Form, { FORM_ERROR } from "app/core/components/form";
import EditorField from "app/editor/components/editor-field";

import createPostMutation from "../mutations/create-post-mutation";
import createPostSchema from "../schemas/create-post-schema";
import updatePostMutation from "../mutations/update-post-mutation";

type PostFormProps = {
  post?: Pick<Post, "id" | "title" | "content">;
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

      console.log(values);

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
      <Stack>
        <TextField name="title" label="Title" placeholder="Title" />
        <EditorField
          name="content"
          fontSize="md"
          label="content"
          features={{ image: true, blockquote: true, heading: true, horizontalRule: true }}
          barMenu
          bubbleMenu
          floatingMenu
        />
      </Stack>
    </Form>
  );
};

export default PostForm;
