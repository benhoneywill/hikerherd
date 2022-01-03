import type { FC } from "react";
import type { ResetPasswordResult } from "../mutations/reset-password-mutation";
import type { ResetPasswordValues } from "../schemas/reset-password-schema";

import { useRouterQuery, useMutation } from "blitz";

import { Button } from "@chakra-ui/button";
import { Stack } from "@chakra-ui/layout";

import TextField from "app/common/components/text-field";
import Form, { FORM_ERROR } from "app/common/components/form";

import resetPasswordSchema from "../schemas/reset-password-schema";
import resetPasswordMutation from "../mutations/reset-password-mutation";
import ResetPasswordError from "../errors/reset-password-error";

type ResetPasswordFormProps = {
  onSuccess?: (user: ResetPasswordResult) => void;
};

const ResetPasswordForm: FC<ResetPasswordFormProps> = ({ onSuccess }) => {
  const query = useRouterQuery();
  const [resetPassword] = useMutation(resetPasswordMutation);

  const initialValues = {
    password: "",
    passwordConfirmation: "",
    token: query.token as string,
  };

  const handleError = (error: unknown) => {
    if (error instanceof ResetPasswordError) {
      return { [FORM_ERROR]: error.message };
    } else {
      return {
        [FORM_ERROR]: "Sorry, there was an unexpected error. Please try again.",
      };
    }
  };

  const handleSubmit = async (values: ResetPasswordValues) => {
    try {
      const result = await resetPassword(values);
      if (onSuccess) onSuccess(result);
    } catch (error) {
      return handleError(error);
    }
  };

  return (
    <Form
      schema={resetPasswordSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      render={(form) => (
        <Stack spacing={6}>
          <Stack spacing={4}>
            <TextField name="password" label="New Password" type="password" />
            <TextField
              name="passwordConfirmation"
              label="Confirm New Password"
              type="password"
            />
          </Stack>

          <Button
            size="lg"
            colorScheme="green"
            isLoading={form.submitting}
            type="submit"
          >
            Reset password
          </Button>
        </Stack>
      )}
    ></Form>
  );
};

export default ResetPasswordForm;
