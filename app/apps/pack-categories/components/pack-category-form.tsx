import type { FC } from "react";
import type { PromiseReturnType } from "blitz";

import { Fragment } from "react";
import { useMutation, useQuery } from "blitz";

import { Center } from "@chakra-ui/layout";
import { FORM_ERROR } from "final-form";
import { Spinner } from "@chakra-ui/spinner";

import TextField from "app/components/forms/components/text-field";
import ModalForm from "app/components/forms/components/modal-form";

import createPackCategoryMutation from "../mutations/create-pack-category-mutation";
import createPackCategorySchema from "../schemas/create-pack-category-schema";
import updatePackCategoryMutation from "../mutations/update-pack-category-mutation";
import packCategoryQuery from "../queries/pack-category-query";

type PackCategoryFormProps = {
  categoryId?: string | null;
  packId: string;
  onSuccess?: (
    category: PromiseReturnType<
      typeof createPackCategoryMutation | typeof updatePackCategoryMutation
    >
  ) => void;
  isOpen: boolean;
  onClose: () => void;
};

const PackCategoryForm: FC<PackCategoryFormProps> = ({
  categoryId,
  packId,
  onSuccess,
  isOpen,
  onClose,
}) => {
  const [createPackCategory] = useMutation(createPackCategoryMutation);
  const [updatePackCategory] = useMutation(updatePackCategoryMutation);

  const [category, { isLoading }] = useQuery(
    packCategoryQuery,
    { id: categoryId },
    { suspense: false, enabled: !!categoryId }
  );

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title={categoryId ? "Edit category" : "Create a category"}
      schema={createPackCategorySchema}
      submitText={categoryId ? "Update" : "Create"}
      initialValues={{
        name: category ? category.name : "",
        packId,
      }}
      onSubmit={async (values) => {
        try {
          let result;

          if (categoryId) {
            result = await updatePackCategory({ id: categoryId, ...values });
          } else {
            result = await createPackCategory(values);
          }

          onClose();

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
            <TextField name="name" label="Name" placeholder="Name" />
          )}
        </Fragment>
      )}
    />
  );
};

export default PackCategoryForm;
