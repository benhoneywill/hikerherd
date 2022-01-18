import type { FC } from "react";
import type { CategoryType, CategoryItem } from "db";
import type { MoveGearResult } from "../mutations/move-gear-mutation";
import type { MoveGearValues } from "../schemas/move-gear-schema";

import { Link, Routes, useMutation, useQuery } from "blitz";

import { Stack, Link as Anchor } from "@chakra-ui/layout";
import { Text, useToast } from "@chakra-ui/react";

import SelectField from "app/common/components/select-field";
import { FORM_ERROR } from "app/common/components/form";
import ModalForm from "app/common/components/modal-form";
import categoriesQuery from "app/features/inventory/queries/categories-query";

import moveGearMutation from "../mutations/move-gear-mutation";
import moveGearSchema from "../schemas/move-gear-schema";

type MoveBetweenWishListFormProps = {
  type?: CategoryType;
  item?: (CategoryItem & { gear: { name: string } }) | null;
  onSuccess?: (result: MoveGearResult) => void;
  isOpen: boolean;
  onClose: () => void;
};

const MoveBetweenWishListForm: FC<MoveBetweenWishListFormProps> = ({
  item,
  onSuccess,
  isOpen,
  type,
  onClose,
}) => {
  const toast = useToast();
  const [moveGear] = useMutation(moveGearMutation);

  const [categories, { isLoading }] = useQuery(
    categoriesQuery,
    { type },
    { suspense: false, enabled: !!type }
  );

  const initialValues = {
    index: 0,
    id: item?.id,
    categoryId: categories?.[0]?.id,
  };

  const typeName = type?.toLowerCase().replace("_", " ");

  const handleSubmit = async (values: MoveGearValues) => {
    try {
      const result = await moveGear(values);

      onClose();

      toast({
        title: "Your gear was moved",
        description: `${item?.gear.name} was moved into your ${typeName}`,
        status: "success",
      });

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
      title={`Move ${item?.gear.name} to your ${typeName}`}
      isLoading={isLoading}
      schema={moveGearSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      disabled={!categories?.length}
      render={() => (
        <Stack spacing={3}>
          {!categories?.length && (
            <Text>
              Before you can move this you need to create a category in{" "}
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

export default MoveBetweenWishListForm;
