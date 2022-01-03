import type { FC } from "react";
import type { ForgotPasswordResult } from "../mutations/forgot-password-mutation";
import type { ForgotPasswordValues } from "../schemas/forgot-password-schema";

import { useMutation } from "blitz";

import { Button } from "@chakra-ui/button";
import { Stack } from "@chakra-ui/layout";

import TextField from "app/common/components/text-field";
import Form, { FORM_ERROR } from "app/common/components/form";

import forgotPasswordSchema from "../schemas/forgot-password-schema";
import forgotPasswordMutation from "../mutations/forgot-password-mutation";

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
      schema={forgotPasswordSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      render={(form) => (
        <Stack spacing={6}>
          <Stack spacing={4}>
            <TextField
              name="email"
              label="Email address"
              placeholder="Enter the email address of your account"
              size="lg"
            />
          </Stack>

          <Button
            size="lg"
            colorScheme="green"
            isLoading={form.submitting}
            type="submit"
          >
            Send reset email
          </Button>
        </Stack>
      )}
    />
  );
};

export default ForgotPasswordForm;
