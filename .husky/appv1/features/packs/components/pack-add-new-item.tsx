import type { FC } from "react";
import type { CreatePackGearResult } from "../mutations/create-pack-gear-mutation";
import type { CreatePackGearValues } from "../schemas/create-pack-gear-schema";

import { useMutation } from "blitz";

import { Button, HStack } from "@chakra-ui/react";

import Form, { FORM_ERROR } from "app/common/components/form";
import useUserPreferences from "app/features/users/hooks/use-user-preferences";
import { ozTog } from "app/common/helpers/display-weight";
import GearFormFields from "app/features/inventory/components/gear-fields";
import useModeColors from "app/common/hooks/use-mode-colors";

import createPackGearMutation from "../mutations/create-pack-gear-mutation";
import createPackGearSchema from "../schemas/create-pack-gear-schema";

type PackAddNewItemProps = {
  packId: string;
  categoryId: string | null;
  onSuccess?: (gear: CreatePackGearResult) => void;
  onClose: () => void;
};

const PackAddNewItem: FC<PackAddNewItemProps> = ({
  packId,
  categoryId,
  onSuccess,
  onClose,
}) => {
  const [createGear] = useMutation(createPackGearMutation);
  const { weightUnit, currency } = useUserPreferences();
  const { gray } = useModeColors();

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
    packId,
    categoryId,
    worn: false,
  };

  const handleSubmit = async (values: CreatePackGearValues) => {
    try {
      if (weightUnit === "IMPERIAL") {
        values.weight = ozTog(values.weight);
      }

      const result = await createGear(values);

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
    <Form
      schema={createPackGearSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      render={(form) => (
        <>
          <GearFormFields includeWorn />
          <HStack
            spacing={3}
            justifyContent="flex-end"
            position="sticky"
            bottom="0"
            py={3}
            mb={-4}
            bg={gray[50]}
          >
            <Button
              colorScheme="green"
              type="submit"
              isLoading={form.submitting}
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </HStack>
        </>
      )}
    />
  );
};

export default PackAddNewItem;
