import type { UseFieldConfig } from "react-final-form";
import type { ComponentPropsWithoutRef } from "react";

import { forwardRef } from "react";

import { useField } from "react-final-form";
import { Textarea } from "@chakra-ui/textarea";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/form-control";

type TextAreaFieldProps = ComponentPropsWithoutRef<typeof Textarea> & {
  name: string;
  label: string;
  controlProps?: ComponentPropsWithoutRef<typeof FormControl>;
  labelProps?: ComponentPropsWithoutRef<typeof FormLabel>;
  fieldProps?: UseFieldConfig<string>;
};

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ name, label, controlProps, fieldProps, labelProps, ...props }, ref) => {
    const { input, meta } = useField(name, fieldProps);

    const { touched, error, submitError, submitting } = meta;

    const normalizedError = Array.isArray(error)
      ? error.join(", ")
      : error || submitError;

    return (
      <FormControl {...controlProps} isInvalid={touched && normalizedError}>
        <FormLabel {...labelProps}>{label}</FormLabel>
        <Textarea {...input} disabled={submitting} {...props} ref={ref} />
        <FormErrorMessage>{normalizedError}</FormErrorMessage>
      </FormControl>
    );
  }
);

export default TextAreaField;
