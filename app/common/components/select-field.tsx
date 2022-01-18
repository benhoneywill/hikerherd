import type { UseFieldConfig } from "react-final-form";
import type { ComponentPropsWithoutRef } from "react";

import { forwardRef } from "react";

import { Select } from "@chakra-ui/select";
import { useField } from "react-final-form";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";

type SelectFieldProps = ComponentPropsWithoutRef<typeof Select> & {
  name: string;
  label: string;
  children: JSX.Element[];
  controlProps?: ComponentPropsWithoutRef<typeof FormControl>;
  labelProps?: ComponentPropsWithoutRef<typeof FormLabel>;
  fieldProps?: UseFieldConfig<string>;
};

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    { name, label, controlProps, fieldProps, labelProps, children, ...props },
    ref
  ) => {
    const { input, meta } = useField(name, {
      ...fieldProps,
    });

    const { touched, error, submitError, submitting } = meta;

    const normalizedError = Array.isArray(error)
      ? error.join(", ")
      : error || submitError;

    return (
      <FormControl {...controlProps} isInvalid={touched && normalizedError}>
        {label && <FormLabel {...labelProps}>{label}</FormLabel>}
        <Select
          {...input}
          value={input.value}
          disabled={submitting}
          {...props}
          ref={ref}
        >
          {children}
        </Select>
        <FormErrorMessage>{normalizedError}</FormErrorMessage>
      </FormControl>
    );
  }
);

export default SelectField;
