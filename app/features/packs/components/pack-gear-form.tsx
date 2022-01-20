import type { FC } from "react";
import type { UpdatePackGearResult } from "../mutations/update-pack-gear-mutations";
import type { UpdatePackGearValues } from "../schemas/update-pack-gear-schema";

import { useMutation, useQuery } from "blitz";

import { Text } from "@chakra-ui/react";

import { FORM_ERROR } from "app/common/components/form";
import ModalForm from "app/common/components/modal-form";
import useUserPreferences from "app/features/users/hooks/use-user-preferences";
import { gToOz, ozTog } from "app/common/helpers/display-weight";
import GearFormFields from "app/features/inventory/components/gear-fields";

import updatePackGearMutation from "../mutations/update-pack-gear-mutations";
import packGearQuery from "../queries/pack-gear-query";
import updatePackGearSchema from "../schemas/update-pack-gear-schema";

type PackGearFormProps = {
  id?: string | null;
  onSuccess?: (gear: UpdatePackGearResult) => void;
  isOpen: boolean;
  onClose: () => void;
};

const PackGearForm: FC<PackGearFormProps> = ({
  id,
  onSuccess,
  isOpen,
  onClose,
}) => {
  const [updateGear] = useMutation(updatePackGearMutation);
  const { weightUnit, currency } = useUserPreferences();

  const [gearItem, { isLoading }] = useQuery(
    packGearQuery,
    { id },
    { suspense: false, enabled: !!id }
  );

  const initialValues = {
    id: gearItem ? gearItem.id : "",
    name: gearItem ? gearItem.gear.name : "",
    weight: gearItem
      ? weightUnit === "IMPERIAL"
        ? gToOz(gearItem.gear.weight)
        : gearItem.gear.weight
      : 0,
    price: gearItem ? gearItem.gear.price : null,
    currency: gearItem ? gearItem.gear.currency : currency,
    link: gearItem ? gearItem.gear.link : null,
    imageUrl: gearItem ? gearItem.gear.imageUrl : null,
    notes: gearItem ? gearItem.gear.notes : null,
    consumable: gearItem ? gearItem.gear.consumable : false,
    worn: gearItem?.worn || false,
  };

  const handleSubmit = async (values: UpdatePackGearValues) => {
    try {
      if (weightUnit === "IMPERIAL") {
        values.weight = ozTog(values.weight);
      }

      const result = await updateGear(values);

      onClose();
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
      isLoading={isLoading}
      title={`Editing ${gearItem?.gear.name}`}
      schema={updatePackGearSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      size="lg"
      render={() => (
        <>
          <GearFormFields includeWorn />
        </>
      )}
    />
  );
};

export default PackGearForm;
