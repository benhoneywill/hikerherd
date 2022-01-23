import type { ZodType } from "zod";
import type { FormProps } from "./form";
import type { ModalProps } from "@chakra-ui/modal";

import { HStack, Center } from "@chakra-ui/layout";
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalContent,
} from "@chakra-ui/modal";
import { Button } from "@chakra-ui/button";
import { Spinner } from "@chakra-ui/spinner";

import Form from "./form";

type ModalFormProps<S extends ZodType<any>> = FormProps<S> & {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
  size?: ModalProps["size"];
};

const ModalForm = <S extends ZodType<any>>({
  isOpen,
  onClose,
  title,
  isLoading = false,
  disabled = false,
  render,
  size,
  ...props
}: ModalFormProps<S>) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <Form
        {...props}
        render={(form) => (
          <ModalContent>
            <ModalHeader>{title}</ModalHeader>
            <ModalCloseButton />

            {isLoading ? (
              <Center p={12}>
                <Spinner />
              </Center>
            ) : (
              <>
                <ModalBody>{render(form)}</ModalBody>
                <ModalFooter>
                  <HStack spacing={3}>
                    <Button
                      colorScheme="green"
                      type="submit"
                      isLoading={form.submitting}
                      isDisabled={disabled}
                    >
                      Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                  </HStack>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        )}
      />
    </Modal>
  );
};

export default ModalForm;
