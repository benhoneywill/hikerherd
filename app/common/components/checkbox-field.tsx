import type { UseFieldConfig } from "react-final-form";
import type { ComponentPropsWithoutRef } from "react";
import type { Checkbox } from "@chakra-ui/checkbox";

import { forwardRef } from "react";

import { useField } from "react-final-form";
import { FormControl, FormErrorMessage } from "@chakra-ui/form-control";
import { FormLabel, HStack, Switch } from "@chakra-ui/react";

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
        <HStack>
          <Switch
            {...input}
            isChecked={input.checked}
            disabled={submitting}
            {...props}
            ref={ref}
          />
          {label && (
            <FormLabel mb="0" htmlFor={input.id}>
              {label}
            </FormLabel>
          )}
        </HStack>
        <FormErrorMessage>{normalizedError}</FormErrorMessage>
      </FormControl>
    );
  }
);

export default CheckboxField;
