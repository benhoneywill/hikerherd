import type { FC } from "react";
import type { CategoryType } from "db";
import type { CreateGearResult } from "../mutations/create-gear-mutation";
import type { UpdateGearResult } from "../mutations/update-gear-mutation";
import type { UpdateGearValues } from "../schemas/update-gear-schema";

import { useMutation, useQuery } from "blitz";

import { Stack, HStack } from "@chakra-ui/layout";

import TextField from "app/common/components/text-field";
import TextAreaField from "app/common/components/text-area-field";
import { FORM_ERROR } from "app/common/components/form";
import ModalForm from "app/common/components/modal-form";
import CheckboxField from "app/common/components/checkbox-field";

import createGearMutation from "../mutations/create-gear-mutation";
import updateGearMutation from "../mutations/update-gear-mutation";
import updateGearSchema from "../schemas/update-gear-schema";
import categoryItemQuery from "../queries/category-item-query";

type GearFormProps = {
  gearId?: string | null;
  type: CategoryType;
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
  type,
}) => {
  const [createGear] = useMutation(createGearMutation);
  const [updateGear] = useMutation(updateGearMutation);

  const [gearItem, { isLoading }] = useQuery(
    categoryItemQuery,
    { id: gearId },
    { suspense: false, enabled: !!gearId }
  );

  const initialValues = {
    id: gearItem ? gearItem.gear.id : "",
    name: gearItem ? gearItem.gear.name : "",
    weight: gearItem ? gearItem.gear.weight : 0,
    price: gearItem ? gearItem.gear.price : null,
    link: gearItem ? gearItem.gear.link : null,
    imageUrl: gearItem ? gearItem.gear.imageUrl : null,
    notes: gearItem ? gearItem.gear.notes : null,
    consumable: gearItem ? gearItem.gear.consumable : false,
  };

  const handleSubmit = async (values: Omit<UpdateGearValues, "id">) => {
    try {
      let result;

      if (gearItem) {
        result = await updateGear({ id: gearItem.gear.id, ...values });
      } else {
        if (!categoryId) throw new Error();
        result = await createGear({ type, categoryId, ...values });
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
      title={gearItem ? gearItem.gear.name : "Add some gear"}
      schema={updateGearSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      render={() => (
        <Stack spacing={3}>
          <TextField name="name" label="Name" placeholder="Name" />
          <HStack>
            <TextField
              type="number"
              name="weight"
              label="Weight"
              placeholder="Weight"
            />
            <TextField
              type="number"
              name="price"
              label="Price"
              placeholder="Price"
            />
          </HStack>
          <TextField name="link" label="Link" placeholder="Link" />
          <TextField
            name="imageUrl"
            label="Image"
            placeholder="Enter an image url"
          />
          <TextAreaField
            name="notes"
            label="Notes"
            placeholder="Enter some gear notes"
          />
          <CheckboxField name="consumable" label="This is a consumable?" />
        </Stack>
      )}
    />
  );
};

export default GearForm;
