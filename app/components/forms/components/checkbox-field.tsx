import type { ComponentPropsWithoutRef } from "react";
import type { Checkbox } from "@chakra-ui/checkbox";

import { forwardRef } from "react";

import { useField } from "react-final-form";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { HStack } from "@chakra-ui/layout";
import { Switch } from "@chakra-ui/switch";
import { FormHelperText } from "@chakra-ui/react";

import getFieldErrorMessage from "../helpers/get-field-error-message";

type CheckboxFieldProps = ComponentPropsWithoutRef<typeof Checkbox> & {
  name: string;
  label: string;
  hint?: string;
};

const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ name, label, hint, ...props }, ref) => {
    const { input, meta } = useField(name, {
      type: "checkbox",
    });

    const error = getFieldErrorMessage(meta);

    return (
      <FormControl isInvalid={meta.touched && error}>
        <HStack>
          <Switch
            {...input}
            isChecked={input.checked}
            disabled={meta.submitting}
            {...props}
            ref={ref}
          />

          {label && (
            <FormLabel mb="0" htmlFor={input.id}>
              {label}
            </FormLabel>
          )}
        </HStack>
        {hint && <FormHelperText>{hint}</FormHelperText>}
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    );
  }
);

export default CheckboxField;
