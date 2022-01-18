import type { FC } from "react";
import type { CategoryType, Gear } from "db";
import type { AddToInventoryResult } from "../mutations/add-to-inventory-mutation";
import type { AddToInventoryValues } from "../schemas/add-to-inventory-schema";

import { Link, Routes, useMutation, useQuery } from "blitz";

import { Stack, Link as Anchor } from "@chakra-ui/layout";
import { Text } from "@chakra-ui/react";

import SelectField from "app/common/components/select-field";
import { FORM_ERROR } from "app/common/components/form";
import ModalForm from "app/common/components/modal-form";
import categoriesQuery from "app/features/inventory/queries/categories-query";

import addToInventoryMutation from "../mutations/add-to-inventory-mutation";
import addToInventorySchema from "../schemas/add-to-inventory-schema";

type AddToInventoryFormProps = {
  type?: CategoryType;
  gear?: Gear;
  onSuccess?: (result: AddToInventoryResult) => void;
  isOpen: boolean;
  onClose: () => void;
};

const AddToInventoryForm: FC<AddToInventoryFormProps> = ({
  gear,
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
    id: gear?.id,
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

  const typeName = type?.toLowerCase().replace("_", " ");

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title={`Add ${gear?.name} to your ${typeName}`}
      isLoading={isLoading}
      schema={addToInventorySchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      disabled={!categories?.length}
      render={() => (
        <Stack spacing={3}>
          {!categories?.length && (
            <Text>
              Before you can start adding gear you need to create a category in{" "}
              <Link
                href={
                  type === "INVENTORY"
                    ? Routes.InventoryPage()
                    : Routes.WishListPage()
                }
              >
                <Anchor color="blue.400" textDecoration="underline">
                  your {typeName}
                </Anchor>
              </Link>
            </Text>
          )}

          {categories?.length && (
            <SelectField name="categoryId" label="Choose a category">
              {categories?.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </SelectField>
          )}
        </Stack>
      )}
    />
  );
};

export default AddToInventoryForm;
