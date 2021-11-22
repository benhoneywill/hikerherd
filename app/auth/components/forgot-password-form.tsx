import type { FC } from "react";

import type { ForgotPasswordResult } from "app/auth/mutations/forgot-password-mutation";

import type { ForgotPasswordValues } from "app/auth/schemas/forgot-password-schema";

import { useMutation } from "blitz";

import TextField from "app/core/components/text-field";
import Form, { FORM_ERROR } from "app/core/components/form";
import forgotPasswordSchema from "app/auth/schemas/forgot-password-schema";
import forgotPasswordMutation from "app/auth/mutations/forgot-password-mutation";

type ForgotPasswordFormProps = {
  onSuccess?: (user: ForgotPasswordResult) => void;
};

const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({ onSuccess }) => {
  const [forgotPassword] = useMutation(forgotPasswordMutation);

  const initialValues = { email: "" };

  const handleSubmit = async (values: ForgotPasswordValues) => {
    try {
      const result = await forgotPassword(values);
      if (onSuccess) onSuccess(result);
    } catch (error) {
      return {
        [FORM_ERROR]: "Sorry, there was an unexpected error. Please try again.",
      };
    }
  };

  return (
    <Form
      submitText="Send Reset Password Instructions"
      schema={forgotPasswordSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <TextField name="email" label="Email" placeholder="Email" />
    </Form>
  );
};

export default ForgotPasswordForm;
