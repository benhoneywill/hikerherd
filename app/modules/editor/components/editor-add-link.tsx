import { useContext } from "react";

import TextField from "app/modules/forms/components/text-field";
import ModalForm from "app/modules/forms/components/modal-form";

import addLinkSchema from "../schemas/add-link-schema";
import editorContext from "../contexts/editor-context";

const EditorAddLink = () => {
  const { editor, addingLink, toggleAddingLink } = useContext(editorContext);

  return (
    <ModalForm
      isOpen={addingLink}
      onClose={toggleAddingLink}
      title="Add a link"
      schema={addLinkSchema}
      initialValues={{ link: editor.getAttributes("link").href || "" }}
      submitText="Add"
      onSubmit={({ link }) => {
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
      }}
      render={() => (
        <TextField name="link" label="Link" placeholder="Enter a URL" />
      )}
    />
  );
};

export default EditorAddLink;
