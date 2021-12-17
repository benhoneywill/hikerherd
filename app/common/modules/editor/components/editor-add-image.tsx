import type { AddImageValues } from "../schemas/add-image-schema";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/modal";

import Form from "app/common/components/form";
import TextField from "app/common/components/text-field";

import useEditorContext from "../hooks/use-editor-context";
import addImageSchema from "../schemas/add-image-schema";

const EditorAddImage = () => {
  const { editor, addingImage, toggleAddingImage } = useEditorContext();

  const addImage = ({ image }: AddImageValues) => {
    editor.chain().focus().setImage({ src: image }).run();
    toggleAddingImage();
  };

  return (
    <Modal isOpen={addingImage} onClose={toggleAddingImage}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a image</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Form
            submitText="Add image"
            schema={addImageSchema}
            initialValues={{ image: "" }}
            onSubmit={addImage}
          >
            <TextField
              name="image"
              label="Image"
              placeholder="Enter an image url"
            />
          </Form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditorAddImage;
