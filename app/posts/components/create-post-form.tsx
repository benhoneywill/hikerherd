import type { FC } from "react";
import type { PromiseReturnType } from "blitz";

import { useMutation } from "blitz";

import { TextField } from "app/core/components/text-field";
import { Form, FORM_ERROR } from "app/core/components/form";
import { Tiptap } from "app/core/components/tiptap";

import createPostMutation from "../mutations/create-post-mutation";
import { CreatePostSchema } from "../schemas/create-post-schema";

type CreatePostFormProps = {
  onSuccess?: (post: PromiseReturnType<typeof createPostMutation>) => void;
};

export const CreatePostForm: FC<CreatePostFormProps> = ({ onSuccess }) => {
  const [createPost] = useMutation(createPostMutation);

  return (
    <div>
      <h1>Create a post</h1>

      <Form
        submitText="Post"
        schema={CreatePostSchema}
        initialValues={{ title: "", content: "", publish: true }}
        onSubmit={async (values) => {
          try {
            const post = await createPost(values);
            if (onSuccess) onSuccess(post);
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
    </div>
  );
};
