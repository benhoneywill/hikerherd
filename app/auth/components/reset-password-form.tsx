import type { ResetPasswordResult } from "app/auth/mutations/reset-password-mutation";
import type { FC } from "react";
import type { ResetPasswordValues } from "app/auth/schemas/reset-password-schema";

import { useRouterQuery, useMutation } from "blitz";

import TextField from "app/common/components/text-field";
import Form, { FORM_ERROR } from "app/common/components/form";
import resetPasswordSchema from "app/auth/schemas/reset-password-schema";
import resetPasswordMutation from "app/auth/mutations/reset-password-mutation";

import ResetPasswordError from "../errors/reset-password-error";

type ResetPasswordFormProps = {
  onSuccess?: (user: ResetPasswordResult) => void;
};

const ResetPasswordForm: FC<ResetPasswordFormProps> = () => {
  const query = useRouterQuery();
  const [resetPassword] = useMutation(resetPasswordMutation);

  const initialValues = { password: "", passwordConfirmation: "" };

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
      await resetPassword({ ...values, token: query.token as string });
    } catch (error) {
      return handleError(error);
    }
  };

  return (
    <Form
      submitText="Reset Password"
      schema={resetPasswordSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <TextField name="password" label="New Password" type="password" />
      <TextField
        name="passwordConfirmation"
        label="Confirm New Password"
        type="password"
      />
    </Form>
  );
};

export default ResetPasswordForm;
