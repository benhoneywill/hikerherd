import type { FC } from "react";
import type { PromiseReturnType } from "blitz";

import { useContext } from "react";
import { useMutation } from "blitz";

import { FORM_ERROR } from "final-form";

import { ozTog } from "app/helpers/display-weight";
import GearFormFields from "app/apps/gear/components/gear-form-fields";
import ModalTabForm from "app/components/forms/components/modal-tab-form";
import userPreferencesContext from "app/apps/users/contexts/user-preferences-context";

import createPackGearMutation from "../mutations/create-pack-gear-mutation";
import createPackGearSchema from "../schemas/create-pack-gear-schema";

type AddPackGearFormProps = {
  categoryId: string | null;
  onSuccess?: (gear: PromiseReturnType<typeof createPackGearMutation>) => void;
  onClose: () => void;
};

const AddPackGearForm: FC<AddPackGearFormProps> = ({
  categoryId,
  onSuccess,
  onClose,
}) => {
  const [createGear] = useMutation(createPackGearMutation);
  const { weightUnit, currency } = useContext(userPreferencesContext);

  if (!categoryId) return null;

  const initialValues = {
    name: "",
    weight: 0,
    price: null,
    type: null,
    currency: currency,
    link: null,
    imageUrl: null,
    notes: null,
    consumable: false,
    categoryId,
    worn: false,
  };

  return (
    <ModalTabForm
      schema={createPackGearSchema}
      onClose={onClose}
      submitText="Add"
      initialValues={initialValues}
      onSubmit={async (values) => {
        try {
          const vals = { ...values };

          if (weightUnit === "IMPERIAL") {
            vals.weight = ozTog(values.weight);
          }

          if (values.price) {
            vals.price = Math.floor(values.price * 100);
          }

          const result = await createGear(vals);

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
      render={() => <GearFormFields includeWorn />}
    />
  );
};

export default AddPackGearForm;
