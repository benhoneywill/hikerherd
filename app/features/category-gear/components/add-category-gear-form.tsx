import type { FC } from "react";
import type { PromiseReturnType } from "blitz";

import { useContext } from "react";
import { useMutation } from "blitz";

import { FORM_ERROR } from "final-form";

import { ozTog } from "app/modules/common/helpers/display-weight";
import GearFormFields from "app/modules/forms/components/gear-form-fields";
import userPreferencesContext from "app/features/users/contexts/user-preferences-context";
import ModalTabForm from "app/modules/forms/components/modal-tab-form";

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
          if (weightUnit === "IMPERIAL") {
            values.weight = ozTog(values.weight);
          }

          if (!categoryId) throw new Error("Category required");
          const result = await createGear(values);

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
