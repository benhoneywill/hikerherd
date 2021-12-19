import type { FC } from "react";
import type { BlogPost } from "db";
import type { CreateBlogPostValues } from "../schemas/create-blog-post-schema";
import type { CreateBlogPostResult } from "../mutations/create-blog-post-mutation";
import type { UpdateBlogPostResult } from "../mutations/update-blog-post-mutation";

import { useMutation } from "blitz";

import { Stack } from "@chakra-ui/layout";

import TextField from "app/common/components/text-field";
import Form, { FORM_ERROR } from "app/common/components/form";
import EditorField from "app/common/modules/editor/components/editor-field";

import createBlogPostMutation from "../mutations/create-blog-post-mutation";
import createBlogPostSchema from "../schemas/create-blog-post-schema";
import updateBlogPostMutation from "../mutations/update-blog-post-mutation";

type BlogPostFormProps = {
  blogSlug: string;
  post?: Pick<BlogPost, "id" | "title" | "content">;
  onSuccess?: (post: CreateBlogPostResult | UpdateBlogPostResult) => void;
};

const BlogPostForm: FC<BlogPostFormProps> = ({ blogSlug, post, onSuccess }) => {
  const [createBlogPost] = useMutation(createBlogPostMutation);
  const [updateBlogPost] = useMutation(updateBlogPostMutation);

  const initialValues = {
    blogSlug,
    title: post ? post.title : "",
    content: post ? JSON.parse(post.content) : "",
  };

  const handleSubmit = async (values: CreateBlogPostValues) => {
    try {
      let result;

      if (post) {
        result = await updateBlogPost({ id: post.id, ...values });
      } else {
        result = await createBlogPost(values);
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
      schema={createBlogPostSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Stack>
        <TextField name="title" label="Title" placeholder="Title" />
        <EditorField
          name="content"
          fontSize="md"
          label="content"
          features={{
            image: true,
            blockquote: true,
            heading: true,
            horizontalRule: true,
          }}
          barMenu
          bubbleMenu
          floatingMenu
        />
      </Stack>
    </Form>
  );
};

export default BlogPostForm;
