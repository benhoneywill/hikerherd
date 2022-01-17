import type { AddLinkValues } from "../schemas/add-link-schema";

import TextField from "app/common/components/text-field";
import ModalForm from "app/common/components/modal-form";

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
    <ModalForm
      isOpen={addingLink}
      onClose={toggleAddingLink}
      title="Add a link"
      schema={addLinkSchema}
      initialValues={{ link: editor.getAttributes("link").href || "" }}
      onSubmit={addLink}
      render={() => (
        <TextField name="link" label="Link" placeholder="Enter a URL" />
      )}
    />
  );
};

export default EditorAddLink;
