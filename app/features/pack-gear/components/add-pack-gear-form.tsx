import type { FC } from "react";
import type { PromiseReturnType } from "blitz";

import { useContext } from "react";
import { useMutation } from "blitz";

import { FORM_ERROR } from "final-form";

import { ozTog } from "app/modules/common/helpers/display-weight";
import GearFormFields from "app/modules/forms/components/gear-form-fields";
import ModalTabForm from "app/modules/forms/components/modal-tab-form";
import userPreferencesContext from "app/features/users/contexts/user-preferences-context";

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
          if (weightUnit === "IMPERIAL") {
            values.weight = ozTog(values.weight);
          }

          if (values.price) {
            values.price = Math.floor(values.price * 100);
          }

          const result = await createGear(values);

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
