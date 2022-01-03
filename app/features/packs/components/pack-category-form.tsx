import type { FC } from "react";
import type { CreatePackCategoryValues } from "../schemas/create-pack-category-schema";
import type { CreatePackCategoryResult } from "../mutations/create-pack-category-mutation";
import type { UpdatePackCategoryResult } from "../mutations/update-pack-category-mutation";

import { useMutation, useQuery } from "blitz";

import { HStack, Stack, Center } from "@chakra-ui/layout";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/modal";
import { Button } from "@chakra-ui/button";
import { Spinner } from "@chakra-ui/spinner";

import TextField from "app/common/components/text-field";
import Form, { FORM_ERROR } from "app/common/components/form";

import createPackCategoryMutation from "../mutations/create-pack-category-mutation";
import createPackCategorySchema from "../schemas/create-pack-category-schema";
import updatePackCategoryMutation from "../mutations/update-pack-category-mutation";
import packCategoryQuery from "../queries/pack-category-query";

type PackCategoryFormProps = {
  categoryId?: string | null;
  packId: string;
  onSuccess?: (
    category: CreatePackCategoryResult | UpdatePackCategoryResult
  ) => void;
  isOpen: boolean;
  onClose: () => void;
};

const PackCategoryForm: FC<PackCategoryFormProps> = ({
  categoryId,
  packId,
  onSuccess,
  isOpen,
  onClose,
}) => {
  const [createPackCategory] = useMutation(createPackCategoryMutation);
  const [updatePackCategory] = useMutation(updatePackCategoryMutation);

  const [category, { isLoading }] = useQuery(
    packCategoryQuery,
    { id: categoryId },
    { suspense: false, enabled: !!categoryId }
  );

  const initialValues = {
    name: category ? category.name : "",
    packId,
  };

  const handleSubmit = async (values: CreatePackCategoryValues) => {
    try {
      let result;

      if (categoryId) {
        result = await updatePackCategory({ id: categoryId, ...values });
      } else {
        result = await createPackCategory(values);
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {category ? category.name : "Create a category"}
        </ModalHeader>
        <ModalCloseButton />
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <Form
            schema={createPackCategorySchema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            render={(form) => (
              <>
                <ModalBody>
                  <Stack spacing={3}>
                    <TextField name="name" label="Name" placeholder="Name" />
                  </Stack>
                </ModalBody>
                <ModalFooter>
                  <HStack spacing={3}>
                    <Button
                      colorScheme="green"
                      type="submit"
                      isLoading={form.submitting}
                    >
                      Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                  </HStack>
                </ModalFooter>
              </>
            )}
          />
        )}
      </ModalContent>
    </Modal>
  );
};

export default PackCategoryForm;
