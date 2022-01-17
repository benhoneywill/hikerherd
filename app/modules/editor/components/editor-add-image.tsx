import type { AddImageValues } from "../schemas/add-image-schema";

import TextField from "app/common/components/text-field";
import ModalForm from "app/common/components/modal-form";

import useEditorContext from "../hooks/use-editor-context";
import addImageSchema from "../schemas/add-image-schema";

const EditorAddImage = () => {
  const { editor, addingImage, toggleAddingImage } = useEditorContext();

  const addImage = ({ image }: AddImageValues) => {
    editor.chain().focus().setImage({ src: image }).run();
    toggleAddingImage();
  };

  return (
    <ModalForm
      isOpen={addingImage}
      onClose={toggleAddingImage}
      title="Add an image"
      schema={addImageSchema}
      initialValues={{ image: "" }}
      onSubmit={addImage}
      render={() => (
        <TextField
          name="image"
          label="Image"
          placeholder="Enter an image url"
        />
      )}
    />
  );
};

export default EditorAddImage;
