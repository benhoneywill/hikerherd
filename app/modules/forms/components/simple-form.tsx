import type { FormComponent } from "../types/form-component";

import { validateZodSchema } from "blitz";

import { Form as FinalForm } from "react-final-form";
import { Stack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Alert, AlertIcon } from "@chakra-ui/alert";

type SimpleFormProps = {
  submitText: string;
};

const SimpleForm: FormComponent<SimpleFormProps> = ({
  schema,
  initialValues,
  onSubmit,
  render,
  submitText,
  ...props
}) => {
  return (
    <FinalForm
      initialValues={initialValues}
      validate={validateZodSchema(schema)}
      onSubmit={onSubmit}
      render={(form) => (
        <form onSubmit={form.handleSubmit} {...props}>
          <Stack spacing={6}>
            {form.submitError && (
              <Alert status="error">
                <AlertIcon />
                {form.submitError}
              </Alert>
            )}

            <Stack spacing={4}>{render(form)}</Stack>

            <Button
              size="lg"
              colorScheme="green"
              isLoading={form.submitting}
              type="submit"
            >
              {submitText}
            </Button>
          </Stack>
        </form>
      )}
    />
  );
};

export default SimpleForm;
