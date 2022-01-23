import type { ComponentPropsWithoutRef } from "react";

import { forwardRef } from "react";

import { Select } from "@chakra-ui/select";
import { useField } from "react-final-form";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";

import getFieldErrorMessage from "../helpers/get-field-error-message";

type SelectFieldProps = ComponentPropsWithoutRef<typeof Select> & {
  name: string;
  label: string;
  children: JSX.Element[];
};

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ name, label, children, ...props }, ref) => {
    const { input, meta } = useField(name);

    const error = getFieldErrorMessage(meta);

    return (
      <FormControl isInvalid={meta.touched && error}>
        {label && <FormLabel>{label}</FormLabel>}

        <Select
          {...input}
          value={input.value}
          disabled={meta.submitting}
          {...props}
          ref={ref}
        >
          {children}
        </Select>

        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    );
  }
);

export default SelectField;
