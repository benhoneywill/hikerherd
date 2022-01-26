import type { FC } from "react";
import type { PromiseReturnType } from "blitz";

import { Fragment, useContext } from "react";
import { useMutation, useQuery } from "blitz";

import { FORM_ERROR } from "final-form";
import { Center } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";

import ModalForm from "app/modules/forms/components/modal-form";
import { gToOz, ozTog } from "app/modules/common/helpers/display-weight";
import GearFormFields from "app/modules/forms/components/gear-form-fields";
import userPreferencesContext from "app/features/users/contexts/user-preferences-context";

import updateCategoryGearMutation from "../mutations/update-category-gear-mutation";
import categoryGearQuery from "../queries/category-gear-query";
import updateCategoryGearSchema from "../schemas/update-category-gear-schema";

type UpdateCategoryGearFormProps = {
  id?: string | null;
  onSuccess?: (
    gear: PromiseReturnType<typeof updateCategoryGearMutation>
  ) => void;
  isOpen: boolean;
  onClose: () => void;
};

const UpdateCategoryGearForm: FC<UpdateCategoryGearFormProps> = ({
  id,
  onSuccess,
  isOpen,
  onClose,
}) => {
  const [updateGear] = useMutation(updateCategoryGearMutation);
  const { weightUnit } = useContext(userPreferencesContext);

  const [gearItem, { isLoading }] = useQuery(
    categoryGearQuery,
    { id: id },
    { suspense: false, enabled: !!id }
  );

  if (!id) return null;

  const initialValues = {
    id,
    name: gearItem?.gear.name,
    weight:
      weightUnit === "IMPERIAL"
        ? gToOz(gearItem?.gear.weight || 0)
        : gearItem?.gear.weight,
    price: gearItem?.gear.price,
    currency: gearItem?.gear.currency,
    link: gearItem?.gear.link,
    imageUrl: gearItem?.gear.imageUrl,
    notes: gearItem?.gear.notes,
    consumable: gearItem?.gear.consumable,
  };

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title={`Editing ${gearItem ? gearItem?.gear.name : ""}`}
      schema={updateCategoryGearSchema}
      initialValues={initialValues}
      size="lg"
      submitText={id ? "Update" : "Create"}
      onSubmit={async (values) => {
        try {
          if (weightUnit === "IMPERIAL") {
            values.weight = ozTog(values.weight);
          }

          let result = await updateGear(values);

          onClose();
          if (onSuccess) {
            onSuccess(result);
          }
        } catch (error: unknown) {
          return {
            [FORM_ERROR]:
              "Oops! Something went wrong saving your gear. Please try again.",
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
            <GearFormFields />
          )}
        </Fragment>
      )}
    />
  );
};

export default UpdateCategoryGearForm;
