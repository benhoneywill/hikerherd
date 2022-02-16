import type { FormComponent } from "../types/form-component";
import type { ModalProps } from "@chakra-ui/modal";

import { validateZodSchema } from "blitz";

import {
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Modal,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Form as FinalForm } from "react-final-form";
import { HStack, Stack, UnorderedList, ListItem } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Alert, AlertIcon } from "@chakra-ui/alert";

type ModalFormProps = {
  submitText: string;
  isOpen: boolean;
  onClose: () => void;
  size?: ModalProps["size"];
  title: string;
};

const ModalForm: FormComponent<ModalFormProps> = ({
  schema,
  initialValues,
  onSubmit,
  render,
  submitText,
  isOpen,
  onClose,
  size,
  title,
  ...props
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <FinalForm
        initialValues={initialValues}
        validate={validateZodSchema(schema)}
        onSubmit={onSubmit}
        render={(form) => (
          <form onSubmit={form.handleSubmit} {...props}>
            <ModalContent>
              <ModalHeader>{title}</ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                {form.submitError && (
                  <Alert status="error" mb={6}>
                    <AlertIcon />
                    {Array.isArray(form.submitError) ? (
                      <UnorderedList>
                        {form.submitError.map((error, i) => (
                          <ListItem key={i}>{error}</ListItem>
                        ))}
                      </UnorderedList>
                    ) : (
                      form.submitError
                    )}
                  </Alert>
                )}

                <Stack spacing={4}>{render(form)}</Stack>
              </ModalBody>

              <ModalFooter>
                <HStack>
                  <Button
                    colorScheme="green"
                    isLoading={form.submitting}
                    type="submit"
                  >
                    {submitText}
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </form>
        )}
      />
    </Modal>
  );
};

export default ModalForm;
