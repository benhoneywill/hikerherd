import type { BlitzPage } from "blitz";

import { useMutation } from "blitz";

import { Layout } from "app/core/layouts/layout";
import { TextField } from "app/core/components/text-field";
import { Form, FORM_ERROR } from "app/core/components/form";
import { ForgotPasswordSchema } from "app/auth/schemas/forgot-password-schema";
import forgotPasswordMutation from "app/auth/mutations/forgot-password-mutation";

const ForgotPasswordPage: BlitzPage = () => {
  const [forgotPassword, { isSuccess }] = useMutation(forgotPasswordMutation);

  return (
    <div>
      <h1>Forgot your password?</h1>

      {isSuccess ? (
        <div>
          <h2>Request Submitted</h2>
          <p>
            If your email is in our system, you will receive instructions to reset your password
            shortly.
          </p>
        </div>
      ) : (
        <Form
          submitText="Send Reset Password Instructions"
          schema={ForgotPasswordSchema}
          initialValues={{ email: "" }}
          onSubmit={async (values) => {
            try {
              await forgotPassword(values);
            } catch (error: any) {
              return {
                [FORM_ERROR]: "Sorry, there was an unexpected error. Please try again.",
              };
            }
          }}
        >
          <TextField name="email" label="Email" placeholder="Email" />
        </Form>
      )}
    </div>
  );
};

ForgotPasswordPage.redirectAuthenticatedTo = "/";
ForgotPasswordPage.getLayout = (page) => <Layout title="Forgot Your Password?">{page}</Layout>;

export default ForgotPasswordPage;
