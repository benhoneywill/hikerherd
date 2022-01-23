import type { FC } from "react";
import type { CategoryType } from "db";
import type { PromiseReturnType } from "blitz";

import { Fragment } from "react";
import { useMutation, useQuery } from "blitz";

import { Center, Stack } from "@chakra-ui/layout";
import { Spinner, Text, useToast } from "@chakra-ui/react";
import { FORM_ERROR } from "final-form";

import SelectField from "app/modules/forms/components/select-field";
import ModalForm from "app/modules/forms/components/modal-form";
import categoriesQuery from "app/features/categories/queries/categories-query";
import displayCategoryType from "app/features/categories/helpers/display-category-type";
import moveCategoryGearMutation from "app/features/category-gear/mutations/move-category-gear-mutation";
import moveCategoryGearSchema from "app/features/category-gear/schemas/move-category-gear-schema";

type ToggleItemTypeFormProps = {
  type: CategoryType;
  itemId?: string | null;
  onSuccess?: (
    result: PromiseReturnType<typeof moveCategoryGearMutation>
  ) => void;
  isOpen: boolean;
  onClose: () => void;
};

const ToggleItemTypeForm: FC<ToggleItemTypeFormProps> = ({
  itemId,
  onSuccess,
  isOpen,
  type,
  onClose,
}) => {
  const toast = useToast();
  const [moveGear] = useMutation(moveCategoryGearMutation);

  const [categories, { isLoading }] = useQuery(
    categoriesQuery,
    { type },
    { suspense: false, enabled: !!type }
  );

  const typeName = displayCategoryType(type);

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title={`Move this gear to your ${typeName}`}
      schema={moveCategoryGearSchema}
      initialValues={{
        index: 0,
        id: itemId,
        categoryId: categories?.[0]?.id,
      }}
      submitText="Move"
      onSubmit={async (values) => {
        try {
          const result = await moveGear(values);

          onClose();

          toast({
            title: "Your gear was moved",
            description: `This was moved into your ${typeName} successfully`,
            status: "success",
          });

          if (onSuccess) {
            onSuccess(result);
          }
        } catch (error: unknown) {
          return {
            [FORM_ERROR]:
              "Sorry, there was an unexpected error. Please try again.",
          };
        }
      }}
      render={() => (
        <Fragment>
          {isLoading ? (
            <Center p={3}>
              <Spinner />
            </Center>
          ) : (
            <Stack spacing={3}>
              {!categories?.length && (
                <Text>
                  Before you can start adding gear you need to create a category
                  in your {typeName}
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
        </Fragment>
      )}
    />
  );
};

export default ToggleItemTypeForm;
