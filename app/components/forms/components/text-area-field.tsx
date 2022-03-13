import type { ComponentPropsWithoutRef } from "react";

import { forwardRef } from "react";

import { useField } from "react-final-form";
import { Textarea } from "@chakra-ui/textarea";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/form-control";

import getFieldErrorMessage from "../helpers/get-field-error-message";

type TextAreaFieldProps = ComponentPropsWithoutRef<typeof Textarea> & {
  name: string;
  label: string;
};

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ name, label, ...props }, ref) => {
    const { input, meta } = useField(name);

    const error = getFieldErrorMessage(meta);

    return (
      <FormControl isInvalid={meta.touched && error}>
        <FormLabel>{label}</FormLabel>
        <Textarea
          {...input}
          disabled={meta.submitting}
          variant="filled"
          {...props}
          ref={ref}
        />
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    );
  }
);

export default TextAreaField;
