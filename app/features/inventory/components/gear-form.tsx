import type { FC } from "react";
import type { CreateGearResult } from "../mutations/create-gear-mutation";
import type { UpdateGearResult } from "../mutations/update-gear-mutation";
import type { UpdateGearValues } from "../schemas/update-gear-schema";

import { useMutation, useQuery } from "blitz";

import { FORM_ERROR } from "app/common/components/form";
import ModalForm from "app/common/components/modal-form";
import useUserPreferences from "app/features/users/hooks/use-user-preferences";
import { gToOz, ozTog } from "app/common/helpers/display-weight";

import createGearMutation from "../mutations/create-gear-mutation";
import updateGearMutation from "../mutations/update-gear-mutation";
import updateGearSchema from "../schemas/update-gear-schema";
import categoryItemQuery from "../queries/category-item-query";

import GearFormFields from "./gear-fields";

type GearFormProps = {
  gearId?: string | null;
  categoryId?: string | null;
  onSuccess?: (gear: CreateGearResult | UpdateGearResult) => void;
  isOpen: boolean;
  onClose: () => void;
};

const GearForm: FC<GearFormProps> = ({
  gearId,
  categoryId,
  onSuccess,
  isOpen,
  onClose,
}) => {
  const [createGear] = useMutation(createGearMutation);
  const [updateGear] = useMutation(updateGearMutation);
  const { weightUnit, currency } = useUserPreferences();

  const [gearItem, { isLoading }] = useQuery(
    categoryItemQuery,
    { id: gearId },
    { suspense: false, enabled: !!gearId }
  );

  const initialValues = {
    id: gearItem ? gearItem.gear.id : "",
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
  };

  const handleSubmit = async (values: Omit<UpdateGearValues, "id">) => {
    try {
      let result;

      if (weightUnit === "IMPERIAL") {
        values.weight = ozTog(values.weight);
      }

      if (gearItem) {
        result = await updateGear({ id: gearItem.gear.id, ...values });
      } else {
        if (!categoryId) throw new Error();
        result = await createGear({ categoryId, ...values });
      }

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
      title={gearId ? `Editing ${gearItem?.gear.name}` : "Add some new gear"}
      schema={updateGearSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      size="lg"
      render={() => <GearFormFields />}
    />
  );
};

export default GearForm;
