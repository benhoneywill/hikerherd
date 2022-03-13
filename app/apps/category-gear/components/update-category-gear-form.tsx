import type { FC } from "react";
import type { PromiseReturnType } from "blitz";

import { Fragment, useContext } from "react";
import { useMutation, useQuery } from "blitz";

import { FORM_ERROR } from "final-form";
import { Center } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";

import ModalForm from "app/components/forms/components/modal-form";
import { gToOz, ozTog, withDecimalPlaces } from "app/helpers/display-weight";
import GearFormFields from "app/apps/gear/components/gear-form-fields";
import userPreferencesContext from "app/apps/users/contexts/user-preferences-context";

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
        ? withDecimalPlaces(gToOz(gearItem?.gear.weight || 0), 2)
        : withDecimalPlaces(gearItem?.gear.weight || 0, 0),
    price: gearItem?.gear.price && gearItem?.gear.price / 100,
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
          const vals = { ...values };

          if (weightUnit === "IMPERIAL") {
            vals.weight = ozTog(values.weight);
          }

          if (values.price) {
            vals.price = Math.floor(values.price * 100);
          }

          let result = await updateGear(vals);

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
