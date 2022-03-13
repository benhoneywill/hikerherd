import type { FC } from "react";
import type { PromiseReturnType } from "blitz";

import { useMutation } from "blitz";

import { FORM_ERROR } from "final-form";

import TextField from "app/components/forms/components/text-field";
import SimpleForm from "app/components/forms/components/simple-form";

import forgotPasswordSchema from "../schemas/forgot-password-schema";
import forgotPasswordMutation from "../mutations/forgot-password-mutation";

type ForgotPasswordFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof forgotPasswordMutation>) => void;
};

const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({ onSuccess }) => {
  const [forgotPassword] = useMutation(forgotPasswordMutation);

  return (
    <SimpleForm
      schema={forgotPasswordSchema}
      initialValues={{ email: "" }}
      submitText="Send reset email"
      large
      onSubmit={async (values) => {
        try {
          const result = await forgotPassword(values);
          if (onSuccess) onSuccess(result);
        } catch (error) {
          return {
            [FORM_ERROR]:
              "Oops! Something went wrong sending your password reset email. Please try again.",
          };
        }
      }}
      render={() => (
        <TextField
          name="email"
          label="Email address"
          placeholder="Enter the email address you signed up with"
          size="lg"
        />
      )}
    />
  );
};

export default ForgotPasswordForm;
