import type { FormProps as FinalFormProps } from "react-final-form";
import type { z } from "zod";
import type { ReactNode, PropsWithoutRef } from "react";

import { validateZodSchema } from "blitz";

import { Form as FinalForm } from "react-final-form";
import { Button } from "@chakra-ui/button";
import { Alert, AlertIcon } from "@chakra-ui/alert";

export { FORM_ERROR } from "final-form";

type FormProps<S extends z.ZodType<any, any>> = PropsWithoutRef<
  Omit<JSX.IntrinsicElements["form"], "onSubmit">
> & {
  children: ReactNode;
  submitText: string;
  schema: S;
  onSubmit: FinalFormProps<z.infer<S>>["onSubmit"];
  initialValues?: FinalFormProps<z.infer<S>>["initialValues"];
};

export const Form = <S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  ...props
}: FormProps<S>) => {
  return (
    <FinalForm
      initialValues={initialValues}
      validate={validateZodSchema(schema)}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, submitError }) => (
        <form onSubmit={handleSubmit} {...props}>
          {children}

          {submitError && (
            <Alert status="error">
              <AlertIcon />
              {submitError}
            </Alert>
          )}

          {submitText && (
            <Button type="submit" isDisabled={submitting} isLoading={submitting}>
              {submitText}
            </Button>
          )}
        </form>
      )}
    />
  );
};
