import type { UseFieldConfig } from "react-final-form";
import type { ComponentPropsWithoutRef } from "react";

import { forwardRef } from "react";

import { useField } from "react-final-form";
import { Input } from "@chakra-ui/input";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/form-control";

type TextFieldProps = ComponentPropsWithoutRef<typeof Input> & {
  name: string;
  label: string;
  type?: "text" | "password" | "email" | "number";
  controlProps?: ComponentPropsWithoutRef<typeof FormControl>;
  labelProps?: ComponentPropsWithoutRef<typeof FormLabel>;
  fieldProps?: UseFieldConfig<string>;
  hideError?: boolean;
};

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      name,
      label,
      controlProps,
      fieldProps,
      labelProps,
      hideError = false,
      ...props
    },
    ref
  ) => {
    const { input, meta } = useField(name, {
      parse:
        props.type === "number"
          ? (v) => (v === "" ? null : Number(v))
          : (v) => (v === "" ? null : v),
      ...fieldProps,
    });

    const { touched, error, submitError, submitting } = meta;

    const normalizedError = Array.isArray(error)
      ? error.join(", ")
      : error || submitError;

    return (
      <FormControl {...controlProps} isInvalid={touched && normalizedError}>
        {label && <FormLabel {...labelProps}>{label}</FormLabel>}
        <Input {...input} disabled={submitting} {...props} ref={ref} />
        {!hideError && <FormErrorMessage>{normalizedError}</FormErrorMessage>}
      </FormControl>
    );
  }
);

export default TextField;
