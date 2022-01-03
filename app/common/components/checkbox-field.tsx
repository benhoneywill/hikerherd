import type { UseFieldConfig } from "react-final-form";
import type { ComponentPropsWithoutRef } from "react";

import { forwardRef } from "react";

import { useField } from "react-final-form";
import { Checkbox } from "@chakra-ui/checkbox";
import { FormControl, FormErrorMessage } from "@chakra-ui/form-control";

type CheckboxFieldProps = ComponentPropsWithoutRef<typeof Checkbox> & {
  name: string;
  label: string;
  controlProps?: ComponentPropsWithoutRef<typeof FormControl>;
  fieldProps?: UseFieldConfig<string>;
};

const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ name, label, controlProps, fieldProps, ...props }, ref) => {
    const { input, meta } = useField(name, {
      type: "checkbox",
      ...fieldProps,
    });

    const { touched, error, submitError, submitting } = meta;

    const normalizedError = Array.isArray(error)
      ? error.join(", ")
      : error || submitError;

    return (
      <FormControl {...controlProps} isInvalid={touched && normalizedError}>
        <Checkbox
          {...input}
          isChecked={input.checked}
          disabled={submitting}
          {...props}
          ref={ref}
        >
          {label}
        </Checkbox>
        <FormErrorMessage>{normalizedError}</FormErrorMessage>
      </FormControl>
    );
  }
);

export default CheckboxField;
