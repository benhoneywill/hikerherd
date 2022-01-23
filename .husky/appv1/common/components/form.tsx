import type {
  FormProps as FinalFormProps,
  FormRenderProps,
} from "react-final-form";
import type { TypeOf, z, ZodType } from "zod";
import type { PropsWithoutRef } from "react";

import { validateZodSchema } from "blitz";

import { Form as FinalForm } from "react-final-form";
import { Alert, AlertIcon } from "@chakra-ui/alert";

export { FORM_ERROR } from "final-form";

export type FormProps<S extends ZodType<any>> = PropsWithoutRef<
  Omit<JSX.IntrinsicElements["form"], "onSubmit">
> & {
  schema: S;
  onSubmit: FinalFormProps<z.infer<S>>["onSubmit"];
  initialValues?: FinalFormProps<z.infer<S>>["initialValues"];
  render: (props: FormRenderProps<TypeOf<S>>) => JSX.Element;
};

const Form = <S extends ZodType<any>>({
  schema,
  initialValues,
  onSubmit,
  render,
  ...props
}: FormProps<S>) => {
  return (
    <FinalForm
      initialValues={initialValues}
      validate={validateZodSchema(schema)}
      onSubmit={onSubmit}
      render={(form) => (
        <form onSubmit={form.handleSubmit} {...props}>
          {form.submitError && (
            <Alert status="error" mb={6}>
              <AlertIcon />
              {form.submitError}
            </Alert>
          )}

          {render(form)}
        </form>
      )}
    />
  );
};

export default Form;
