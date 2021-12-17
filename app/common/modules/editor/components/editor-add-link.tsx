import type { AddLinkValues } from "../schemas/add-link-schema";

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
import addLinkSchema from "../schemas/add-link-schema";

const EditorAddLink = () => {
  const { editor, addingLink, toggleAddingLink } = useEditorContext();

  const addLink = ({ link }: AddLinkValues) => {
    if (!link || link === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: link })
      .run();

    toggleAddingLink();
  };

  return (
    <Modal isOpen={addingLink} onClose={toggleAddingLink}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a link</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Form
            submitText="Add link"
            schema={addLinkSchema}
            initialValues={{ link: editor.getAttributes("link").href || "" }}
            onSubmit={addLink}
          >
            <TextField name="link" label="Link" placeholder="Enter a URL" />
          </Form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditorAddLink;
