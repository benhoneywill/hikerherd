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
import { useColorMode } from "@chakra-ui/react";

import useEditorField from "../hooks/use-editor-field";
import EditorActionsProvider from "../providers/editor-actions-provider";

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
    padding-top: var(--chakra-space-2);
    padding-bottom: var(--chakra-space-2);
    border-radius: var(--chakra-radii-md);
    border: 1px solid;
    border-color: transparent;
    background: ${(props) =>
      props["data-color-mode"] === "dark"
        ? "var(--chakra-colors-whiteAlpha-50)"
        : "var(--chakra-colors-gray-100)"};

    &:focus {
      outline: none;
      background: none;
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

    ${(props) =>
      props["data-has-error"] &&
      css`
        border-color: var(--chakra-colors-red-500);
        box-shadow: 0 0 0 1px var(--chakra-colors-red-500);
      `}

    ${(props) =>
      props["data-focused"] &&
      css`
        border-color: var(--chakra-colors-blue-500);
        box-shadow: 0 0 0 1px var(--chakra-colors-blue-500);
      `}

    ${(props) =>
      props["data-has-bar-menu"] &&
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
  required?: string;
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
  required,
  autofocus,
  label,
  bubbleMenu,
  floatingMenu,
  barMenu,
}) => {
  const { editor, error, meta } = useEditorField(name, {
    features,
    fieldProps,
    required,
    autofocus,
  });

  const { colorMode } = useColorMode();

  if (!editor) return null;

  return (
    <EditorActionsProvider editor={editor}>
      <FormControl isInvalid={!!error}>
        {label && <FormLabel htmlFor={name}>{label}</FormLabel>}

        <FakeInput
          data-focused={meta.focused}
          data-has-error={!!error}
          data-has-bar-menu={barMenu}
          data-color-mode={colorMode}
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
