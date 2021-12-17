import type {
  FormProps as FinalFormProps,
  FormRenderProps,
  RenderableProps,
} from "react-final-form";
import type { TypeOf, z, ZodType } from "zod";
import type { ReactNode, PropsWithoutRef } from "react";

import { validateZodSchema } from "blitz";

import { Form as FinalForm } from "react-final-form";
import { Button } from "@chakra-ui/button";
import { Alert, AlertIcon } from "@chakra-ui/alert";
import { HStack, Stack } from "@chakra-ui/layout";

export { FORM_ERROR } from "final-form";

type FormProps<S extends ZodType<any>> = PropsWithoutRef<
  Omit<JSX.IntrinsicElements["form"], "onSubmit">
> & {
  children: ReactNode;
  submitText: string;
  schema: S;
  onSubmit: FinalFormProps<z.infer<S>>["onSubmit"];
  initialValues?: FinalFormProps<z.infer<S>>["initialValues"];
  renderButtons?: (
    props: RenderableProps<FormRenderProps<TypeOf<S>>>
  ) => JSX.Element;
};

const Form = <S extends ZodType<any>>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  renderButtons,
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
              {renderButtons && renderButtons(form)}

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
