import type { FC } from "react";
import type { PromiseReturnType } from "blitz";

import { Fragment, useContext } from "react";
import { useMutation, useQuery } from "blitz";

import { FORM_ERROR } from "final-form";
import { Center } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";

import ModalForm from "app/modules/forms/components/modal-form";
import {
  gToOz,
  ozTog,
  withDecimalPlaces,
} from "app/modules/common/helpers/display-weight";
import GearFormFields from "app/modules/forms/components/gear-form-fields";
import userPreferencesContext from "app/features/users/contexts/user-preferences-context";

import updatePackGearMutation from "../mutations/update-pack-gear-mutations";
import packGearQuery from "../queries/pack-gear-query";
import updatePackGearSchema from "../schemas/update-pack-gear-schema";

type UpdatePackGearFormProps = {
  id?: string | null;
  onSuccess?: (gear: PromiseReturnType<typeof updatePackGearMutation>) => void;
  isOpen: boolean;
  onClose: () => void;
};

const UpdatePackGearForm: FC<UpdatePackGearFormProps> = ({
  id,
  onSuccess,
  isOpen,
  onClose,
}) => {
  const [updateGear] = useMutation(updatePackGearMutation);
  const { weightUnit } = useContext(userPreferencesContext);

  const [gearItem, { isLoading }] = useQuery(
    packGearQuery,
    { id },
    { suspense: false, enabled: !!id }
  );

  const initialValues = {
    id: gearItem?.id,
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
    worn: gearItem?.worn,
  };

  return (
    <ModalForm
      isOpen={isOpen}
      onClose={onClose}
      title="Edit gear"
      schema={updatePackGearSchema}
      size="lg"
      submitText="Update"
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

          const result = await updateGear(vals);

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
            <GearFormFields includeWorn />
          )}
        </Fragment>
      )}
    />
  );
};

export default UpdatePackGearForm;
