import type {
  FormProps as FinalFormProps,
  FormRenderProps,
  RenderableProps,
} from "react-final-form";
import type { TypeOf, z } from "zod";
import type { ReactNode, PropsWithoutRef } from "react";

import { validateZodSchema } from "blitz";

import { Form as FinalForm } from "react-final-form";
import { Button } from "@chakra-ui/button";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import { HStack, Stack } from "@chakra-ui/layout";

export { FORM_ERROR } from "final-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericZodSchema = z.ZodType<any, any>;

type FormProps<S extends GenericZodSchema> = PropsWithoutRef<
  Omit<JSX.IntrinsicElements["form"], "onSubmit">
> & {
  children: ReactNode;
  submitText: string;
  schema: S;
  onSubmit: FinalFormProps<z.infer<S>>["onSubmit"];
  initialValues?: FinalFormProps<z.infer<S>>["initialValues"];
  aditionalActions?: (props: RenderableProps<FormRenderProps<TypeOf<S>>>) => JSX.Element;
};

const Form = <S extends GenericZodSchema>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  aditionalActions,
  ...props
}: FormProps<S>) => {
  return (
    <FinalForm
      initialValues={initialValues}
      validate={validateZodSchema(schema)}
      onSubmit={onSubmit}
      render={(form) => (
        <form onSubmit={form.handleSubmit} {...props}>
          <Stack>
            {form.submitError && (
              <Alert status="error">
                <AlertIcon />
                {form.submitError}
              </Alert>
            )}

            <div>{children}</div>

            <HStack>
              {aditionalActions && aditionalActions(form)}

              <Button type="submit" isLoading={form.submitting}>
                {submitText}
              </Button>
            </HStack>
          </Stack>
        </form>
      )}
    />
  );
};

export default Form;
