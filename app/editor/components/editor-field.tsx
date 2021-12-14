import type { FC } from "react";
import type { UseFieldConfig } from "react-final-form";
import type { BoxProps } from "@chakra-ui/layout";
import type { EditorFeatures } from "../../editor/helpers/get-editor-extensions";

import React from "react";

import { Box } from "@chakra-ui/layout";
import { EditorContent } from "@tiptap/react";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/form-control";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

import useEditorField from "../hooks/use-editor-field";

import EditorFloatingMenu from "./editor-floating-menu";
import EditorBubbleMenu from "./editor-bubble-menu";
import EditorHtml from "./editor-html";
import EditorBarMenu from "./editor-bar-menu";

const FakeInput = styled(Box)`
  .ProseMirror {
    width: 100%;
    min-width: 0px;
    min-height: var(--chakra-sizes-20);
    outline: 2px solid transparent;
    outline-offset: 2px;
    position: relative;
    appearance: none;
    transition-property: var(--chakra-transition-property-common);
    transition-duration: var(--chakra-transition-duration-normal);
    font-size: var(--chakra-fontSizes-md);
    padding-inline-start: var(--chakra-space-4);
    padding-inline-end: var(--chakra-space-4);
    border-radius: var(--chakra-radii-md);
    border: 1px solid;
    border-color: inherit;
    background: inherit;

    ${({ invalid }) =>
      invalid &&
      css`
        border-color: var(--chakra-colors-red-500);
        box-shadow: 0 0 0 1px var(--chakra-colors-red-500);
      `}

    ${({ focused }) =>
      focused &&
      css`
        border-color: var(--chakra-colors-blue-500);
        box-shadow: 0 0 0 1px var(--chakra-colors-blue-500);
      `}
  }
`;

type EditorFieldProps = {
  name: string;
  fieldProps?: UseFieldConfig<string>;
  fontSize?: BoxProps["fontSize"];
  features?: EditorFeatures;
  required?: boolean;
  label?: string;
  autofocus?: boolean;
  bubbleMenu?: boolean;
  floatingMenu?: boolean;
  barMenu?: boolean;
};

const EditorField: FC<EditorFieldProps> = ({
  name,
  fieldProps,
  fontSize,
  features = {},
  required = true,
  autofocus,
  label,
  bubbleMenu,
  floatingMenu,
  barMenu,
}) => {
  const { editor, error, meta } = useEditorField(name, {
    features,
    fieldProps,
    options: {
      required,
      autofocus,
    },
  });

  if (!editor) return null;

  return (
    <FormControl isInvalid={!!error}>
      {bubbleMenu && <EditorBubbleMenu editor={editor} features={features} />}
      {floatingMenu && <EditorFloatingMenu editor={editor} features={features} />}

      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <FakeInput focused={meta.focused} invalid={!!error}>
        <EditorHtml fontSize={fontSize || "md"}>
          <EditorContent editor={editor} disabled={meta.submitting} />
        </EditorHtml>
      </FakeInput>

      {barMenu && <EditorBarMenu editor={editor} features={features} />}

      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default EditorField;
