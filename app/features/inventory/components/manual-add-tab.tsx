import type { FC } from "react";
import type { CreateGearResult } from "../mutations/create-gear-mutation";
import type { UpdateGearValues } from "../schemas/update-gear-schema";

import { useMutation } from "blitz";

import { Button, HStack } from "@chakra-ui/react";

import Form, { FORM_ERROR } from "app/common/components/form";
import useUserPreferences from "app/features/users/hooks/use-user-preferences";
import { ozTog } from "app/common/helpers/display-weight";
import useModeColors from "app/common/hooks/use-mode-colors";

import createGearMutation from "../mutations/create-gear-mutation";
import createGearSchema from "../schemas/create-gear-schema";

import GearFormFields from "./gear-fields";

type ManualAddTabProps = {
  categoryId?: string | null;
  onSuccess?: (gear: CreateGearResult) => void;
  onClose: () => void;
};

const ManualAddTab: FC<ManualAddTabProps> = ({
  categoryId,
  onSuccess,
  onClose,
}) => {
  const [createGear] = useMutation(createGearMutation);
  const { gray } = useModeColors();

  const { weightUnit, currency } = useUserPreferences();

  const initialValues = {
    categoryId: categoryId || "",
    id: "",
    name: "",
    weight: 0,
    price: null,
    currency: currency,
    link: null,
    imageUrl: null,
    notes: null,
    consumable: false,
  };

  const handleSubmit = async (values: Omit<UpdateGearValues, "id">) => {
    try {
      if (weightUnit === "IMPERIAL") {
        values.weight = ozTog(values.weight);
      }

      if (!categoryId) throw new Error("Category required");
      const result = await createGear({ categoryId, ...values });

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
    <Form
      schema={createGearSchema}
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

export default ManualAddTab;
