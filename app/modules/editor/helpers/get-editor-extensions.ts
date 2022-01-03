import type { StarterKitOptions } from "@tiptap/starter-kit";
import type { Extensions } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Focus from "@tiptap/extension-focus";

export type EditorFeatures = {
  horizontalRule?: boolean;
  image?: boolean;
  heading?: boolean;
  blockquote?: boolean;
};

const getEditorExtensions = (features: EditorFeatures = {}) => {
  const starterKitOptions: Partial<StarterKitOptions> = {};

  if (!features.heading) starterKitOptions.heading = false;
  if (!features.horizontalRule) starterKitOptions.horizontalRule = false;
  if (!features.blockquote) starterKitOptions.blockquote = false;

  const extensions: Extensions = [
    StarterKit.configure(starterKitOptions),
    Placeholder,
    Focus,
    Link.configure({ openOnClick: false }),
  ];

  if (features.image) {
    extensions.push(Image);
  }

  return extensions;
};

export default getEditorExtensions;
