import type { FC } from "react";
import type { CategoryType } from "db";
import type { CreateCategoryValues } from "../schemas/create-category-schema";
import type { CreateCategoryResult } from "../mutations/create-category-mutation";
import type { UpdateCategoryResult } from "../mutations/update-category-mutation";

import { useMutation, useQuery } from "blitz";

import { Stack } from "@chakra-ui/layout";

import TextField from "app/common/components/text-field";
import { FORM_ERROR } from "app/common/components/form";
import ModalForm from "app/common/components/modal-form";

import createCategoryMutation from "../mutations/create-category-mutation";
import createCategorySchema from "../schemas/create-category-schema";
import updateCategoryMutation from "../mutations/update-category-mutation";
import categoryQuery from "../queries/category-query";

type CategoryFormProps = {
  categoryId?: string | null;
  type: CategoryType;
  onSuccess?: (category: CreateCategoryResult | UpdateCategoryResult) => void;
  isOpen: boolean;
  onClose: () => void;
};

const CategoryForm: FC<CategoryFormProps> = ({
  categoryId,
  onSuccess,
  isOpen,
  type,
  onClose,
}) => {
  const [createCategory] = useMutation(createCategoryMutation);
  const [updateCategory] = useMutation(updateCategoryMutation);

  const [category, { isLoading }] = useQuery(
    categoryQuery,
    { id: categoryId },
    { suspense: false, enabled: !!categoryId }
  );

  const initialValues = {
    name: category ? category.name : "",
    type,
  };

  const handleSubmit = async (values: CreateCategoryValues) => {
    try {
      let result;

      if (categoryId) {
        result = await updateCategory({ id: categoryId, ...values });
      } else {
        result = await createCategory(values);
      }

      onClose();

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error: unknown) {
      return {
        [FORM_ERROR]: "Sorry, there was an unexpected error. Please try again.",
      };
    }
  };

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title={category ? category.name : "Create a category"}
      isLoading={isLoading}
      schema={createCategorySchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      render={() => (
        <Stack spacing={3}>
          <TextField name="name" label="Name" placeholder="Name" />
        </Stack>
      )}
    />
  );
};

export default CategoryForm;
