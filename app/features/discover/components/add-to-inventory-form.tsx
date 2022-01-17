import type { FC } from "react";
import type { CategoryType } from "db";
import type { AddToInventoryResult } from "../mutations/add-to-inventory-mutation";
import type { AddToInventoryValues } from "../schemas/add-to-inventory-schema";

import { useMutation, useQuery } from "blitz";

import { Stack } from "@chakra-ui/layout";

import SelectField from "app/common/components/select-field";
import { FORM_ERROR } from "app/common/components/form";
import ModalForm from "app/common/components/modal-form";
import categoriesQuery from "app/features/inventory/queries/categories-query";

import addToInventoryMutation from "../mutations/add-to-inventory-mutation";
import addToInventorySchema from "../schemas/add-to-inventory-schema";

type AddToInventoryFormProps = {
  type?: CategoryType;
  gearId?: string;
  onSuccess?: (result: AddToInventoryResult) => void;
  isOpen: boolean;
  onClose: () => void;
};

const AddToInventoryForm: FC<AddToInventoryFormProps> = ({
  gearId,
  onSuccess,
  isOpen,
  type,
  onClose,
}) => {
  const [add] = useMutation(addToInventoryMutation);

  const [categories, { isLoading }] = useQuery(
    categoriesQuery,
    { type },
    { suspense: false, enabled: !!type }
  );

  const initialValues = {
    type,
    id: gearId,
    categoryId: categories?.[0]?.id,
  };

  const handleSubmit = async (values: AddToInventoryValues) => {
    try {
      const result = await add(values);

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
      title={`Add to your ${type?.toLowerCase()}`}
      isLoading={isLoading}
      schema={addToInventorySchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      render={() => (
        <Stack spacing={3}>
          <SelectField name="categoryId" label="CategoryId">
            {categories?.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </SelectField>
        </Stack>
      )}
    />
  );
};

export default AddToInventoryForm;
