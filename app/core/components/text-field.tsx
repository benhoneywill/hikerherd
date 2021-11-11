import type { UseFieldConfig } from "react-final-form";
import type { ComponentPropsWithoutRef, PropsWithoutRef } from "react";

import { forwardRef } from "react";

import { useField } from "react-final-form";
import { Input } from "@chakra-ui/input";
import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/form-control";

type TextFieldProps = ComponentPropsWithoutRef<typeof Input> & {
  name: string;
  label: string;
  type?: "text" | "password" | "email" | "number";
  controlProps?: ComponentPropsWithoutRef<typeof FormControl>;
  labelProps?: ComponentPropsWithoutRef<typeof FormLabel>;
  fieldProps?: UseFieldConfig<string>;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ name, label, controlProps, fieldProps, labelProps, ...props }, ref) => {
    const {
      input,
      meta: { touched, error, submitError, submitting },
    } = useField(name, {
      parse: props.type === "number" ? (v) => Number(v) : (v) => (v === "" ? null : v),
      ...fieldProps,
    });

    const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError;

    return (
      <FormControl {...controlProps} isInvalid={touched && normalizedError}>
        <FormLabel {...labelProps}>
          {label}
          <Input {...input} disabled={submitting} {...props} ref={ref} />
        </FormLabel>

        <FormErrorMessage>{normalizedError}</FormErrorMessage>
      </FormControl>
    );
  }
);
