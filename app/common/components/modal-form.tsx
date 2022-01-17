import type { ZodType } from "zod";
import type { FormProps } from "./form";

import { HStack, Center } from "@chakra-ui/layout";
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

import Form from "./form";

type ModalFormProps<S extends ZodType<any>> = FormProps<S> & {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isLoading?: boolean;
};

const ModalForm = <S extends ZodType<any>>({
  isOpen,
  onClose,
  title,
  isLoading = false,
  render,
  ...props
}: ModalFormProps<S>) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        {isLoading ? (
          <Center p={12}>
            <Spinner />
          </Center>
        ) : (
          <Form
            {...props}
            render={(form) => (
              <>
                <ModalBody>{render(form)}</ModalBody>
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

export default ModalForm;
