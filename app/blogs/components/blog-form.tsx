import type { FC } from "react";
import type { CreateBlogValues } from "../schemas/create-blog-schema";
import type { CreateBlogResult } from "../mutations/create-blog-mutation";

import { useMutation } from "blitz";

import { Stack } from "@chakra-ui/layout";

import TextField from "app/common/components/text-field";
import Form, { FORM_ERROR } from "app/common/components/form";

import createBlogMutation from "../mutations/create-blog-mutation";
import createBlogSchema from "../schemas/create-blog-schema";
import BlogCreateError from "../errors/blog-create-error";

type BlogFormProps = {
  onSuccess?: (blog: CreateBlogResult) => void;
};

const BlogForm: FC<BlogFormProps> = ({ onSuccess }) => {
  const [createBlog] = useMutation(createBlogMutation);

  const initialValues = {
    name: "",
  };

  const handleError = (error: unknown) => {
    if (error instanceof BlogCreateError && error.nameTaken) {
      return { name: "This name is not available" };
    }

    return { [FORM_ERROR]: "There was an unexpected error" };
  };

  const handleSubmit = async (values: CreateBlogValues) => {
    try {
      const result = await createBlog(values);
      if (onSuccess) onSuccess(result);
    } catch (error: unknown) {
      return handleError(error);
    }
  };

  return (
    <Form
      submitText="Create blog"
      schema={createBlogSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <Stack>
        <TextField name="name" label="Name" placeholder="Name" />
      </Stack>
    </Form>
  );
};

export default BlogForm;
