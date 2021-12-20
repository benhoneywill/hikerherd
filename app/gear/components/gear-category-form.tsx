import type { FC } from "react";
import type { GearCategory } from "db";
import type { CreateGearCategoryValues } from "../schemas/create-gear-category-schema";
import type { CreateGearCategoryResult } from "../mutations/create-gear-category-mutation";
import type { UpdateGearCategoryResult } from "../mutations/update-gear-category-mutation";

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

import createGearCategoryMutation from "../mutations/create-gear-category-mutation";
import createGearCategorySchema from "../schemas/create-gear-category-schema";
import updateGearCategoryMutation from "../mutations/update-gear-category-mutation";

type GearCategoryFormProps = {
  category?: Pick<GearCategory, "id" | "name">;
  onSuccess?: (
    gear: CreateGearCategoryResult | UpdateGearCategoryResult
  ) => void;
  isOpen: boolean;
  onClose: () => void;
};

const GearCategoryForm: FC<GearCategoryFormProps> = ({
  category,
  onSuccess,
  isOpen,
  onClose,
}) => {
  const [createGearCategory] = useMutation(createGearCategoryMutation);
  const [updateGearCategory] = useMutation(updateGearCategoryMutation);

  const initialValues = {
    name: category ? category.name : "",
  };

  const handleSubmit = async (values: CreateGearCategoryValues) => {
    try {
      let result;

      if (category) {
        result = await updateGearCategory({ id: category.id, ...values });
      } else {
        result = await createGearCategory(values);
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
        <ModalHeader>
          {category ? category.name : "Create a category"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Form
            submitText="Save"
            schema={createGearCategorySchema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            <Stack>
              <TextField name="name" label="Name" placeholder="Name" />
            </Stack>
          </Form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GearCategoryForm;
