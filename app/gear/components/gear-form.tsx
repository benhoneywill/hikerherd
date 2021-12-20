import type { FC } from "react";
import type { Gear } from "db";
import type { CreateGearValues } from "../schemas/create-gear-schema";
import type { CreateGearResult } from "../mutations/create-gear-mutation";
import type { UpdateGearResult } from "../mutations/update-gear-mutation";

import { useMutation } from "blitz";

import { Stack } from "@chakra-ui/layout";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/modal";

import TextField from "app/common/components/text-field";
import Form, { FORM_ERROR } from "app/common/components/form";

import createGearMutation from "../mutations/create-gear-mutation";
import createGearSchema from "../schemas/create-gear-schema";
import updateGearMutation from "../mutations/update-gear-mutation";

type GearFormProps = {
  gear?: Pick<Gear, "id" | "name" | "weight">;
  categoryId?: string;
  onSuccess?: (gear: CreateGearResult | UpdateGearResult) => void;
  isOpen: boolean;
  onClose: () => void;
};

const GearForm: FC<GearFormProps> = ({
  gear,
  categoryId,
  onSuccess,
  isOpen,
  onClose,
}) => {
  const [createGear] = useMutation(createGearMutation);
  const [updateGear] = useMutation(updateGearMutation);

  const initialValues = {
    categoryId,
    name: gear ? gear.name : "",
    weight: gear ? gear.weight : 0,
  };

  const handleSubmit = async (values: CreateGearValues) => {
    try {
      let result;

      console.log(values);

      if (gear) {
        result = await updateGear({ id: gear.id, ...values });
      } else {
        result = await createGear(values);
      }

      if (onSuccess) {
        onSuccess(result);
        onClose();
      }
    } catch (error: unknown) {
      return {
        [FORM_ERROR]: "Sorry, there was an unexpected error. Please try again.",
      };
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{gear ? gear.name : "Add some gear"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Form
            submitText="Save"
            schema={createGearSchema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            <Stack>
              <TextField name="name" label="Name" placeholder="Name" />
              <TextField
                type="number"
                name="weight"
                label="Weight"
                placeholder="Weight"
              />
            </Stack>
          </Form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GearForm;
