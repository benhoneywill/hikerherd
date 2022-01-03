import type { FC } from "react";
import type { UseFieldConfig } from "react-final-form";
import type { BoxProps } from "@chakra-ui/layout";
import type { EditorFeatures } from "../helpers/get-editor-extensions";

import React from "react";

import { Box } from "@chakra-ui/layout";
import { EditorContent } from "@tiptap/react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

import useEditorField from "../hooks/use-editor-field";

import EditorFloatingMenu from "./editor-floating-menu";
import EditorBubbleMenu from "./editor-bubble-menu";
import EditorHtml from "./editor-html";
import EditorBarMenu from "./editor-bar-menu";
import EditorActionsProvider from "./editor-actions-provider";

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
    padding-top: var(--chakra-space-2);
    padding-bottom: var(--chakra-space-2);
    border-radius: var(--chakra-radii-md);
    border: 1px solid;
    border-color: inherit;
    background: inherit;

    &:focus {
      outline: none;
    }

    img.has-focus,
    hr.has-focus {
      outline: 2px solid var(--chakra-colors-blue-500);
    }

    /* Editor placeholder styles */
    p.is-editor-empty:first-of-type::before {
      color: var(--chakra-colors-gray-400);
      content: attr(data-placeholder);
      float: left;
      height: 0;
      pointer-events: none;
    }

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

    ${({ hasBarMenu }) =>
      hasBarMenu &&
      css`
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
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
  required = false,
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
    <EditorActionsProvider editor={editor}>
      <FormControl isInvalid={!!error}>
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}

        <FakeInput
          focused={meta.focused}
          invalid={!!error}
          hasBarMenu={barMenu}
        >
          {bubbleMenu && <EditorBubbleMenu features={features} />}
          {floatingMenu && <EditorFloatingMenu features={features} />}

          <EditorHtml fontSize={fontSize || "md"}>
            <EditorContent editor={editor} disabled={meta.submitting} />
          </EditorHtml>
        </FakeInput>

        {barMenu && <EditorBarMenu features={features} />}

        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    </EditorActionsProvider>
  );
};

export default EditorField;
