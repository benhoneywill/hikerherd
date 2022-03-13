import type { FC } from "react";
import type { PromiseReturnType } from "blitz";

import { useContext } from "react";
import { useMutation } from "blitz";

import { FORM_ERROR } from "final-form";

import { ozTog } from "app/helpers/display-weight";
import GearFormFields from "app/apps/gear/components/gear-form-fields";
import userPreferencesContext from "app/apps/users/contexts/user-preferences-context";
import ModalTabForm from "app/components/forms/components/modal-tab-form";

import createCategoryGearMutation from "../mutations/create-category-gear-mutation";
import createCategoryGearSchema from "../schemas/create-category-gear-schema";

type AddCategoryGearFormProps = {
  categoryId?: string | null;
  onSuccess?: (
    gear: PromiseReturnType<typeof createCategoryGearMutation>
  ) => void;
  onClose: () => void;
};

const AddCategoryGearForm: FC<AddCategoryGearFormProps> = ({
  categoryId,
  onSuccess,
  onClose,
}) => {
  const [createGear] = useMutation(createCategoryGearMutation);

  const { weightUnit, currency } = useContext(userPreferencesContext);

  if (!categoryId) return null;

  const initialValues = {
    categoryId,
    name: "",
    weight: 0,
    price: null,
    currency: currency,
    link: null,
    imageUrl: null,
    notes: null,
    consumable: false,
  };

  return (
    <ModalTabForm
      schema={createCategoryGearSchema}
      initialValues={initialValues}
      onClose={onClose}
      submitText="Add"
      onSubmit={async (values) => {
        try {
          const vals = { ...values };

          if (weightUnit === "IMPERIAL") {
            vals.weight = ozTog(values.weight);
          }

          if (values.price) {
            vals.price = Math.floor(values.price * 100);
          }

          if (!categoryId) throw new Error("Category required");
          const result = await createGear(vals);

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
      render={() => <GearFormFields />}
    />
  );
};

export default AddCategoryGearForm;
