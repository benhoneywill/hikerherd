import type { BlitzPage } from "blitz";

import { useRouterQuery, Link, useMutation, Routes } from "blitz";

import { Layout } from "app/core/layouts/layout";
import { TextField } from "app/core/components/text-field";
import { Form, FORM_ERROR } from "app/core/components/form";
import { ResetPasswordSchema } from "app/auth/schemas/reset-password-schema";
import resetPasswordMutation from "app/auth/mutations/reset-password-mutation";

const ResetPasswordPage: BlitzPage = () => {
  const query = useRouterQuery();
  const [resetPassword, { isSuccess }] = useMutation(resetPasswordMutation);

  return (
    <div>
      <h1>Set a New Password</h1>

      {isSuccess ? (
        <div>
          <h2>Password Reset Successfully</h2>
          <p>
            Go to the <Link href={Routes.HomePage()}>homepage</Link>
          </p>
        </div>
      ) : (
        <Form
          submitText="Reset Password"
          schema={ResetPasswordSchema}
          initialValues={{ password: "", passwordConfirmation: "", token: query.token as string }}
          onSubmit={async (values) => {
            try {
              await resetPassword(values);
            } catch (error: any) {
              if (error.name === "ResetPasswordError") {
                return {
                  [FORM_ERROR]: error.message,
                };
              } else {
                return {
                  [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                };
              }
            }
          }}
        >
          <TextField name="password" label="New Password" type="password" />
          <TextField name="passwordConfirmation" label="Confirm New Password" type="password" />
        </Form>
      )}
    </div>
  );
};

ResetPasswordPage.redirectAuthenticatedTo = "/";
ResetPasswordPage.getLayout = (page) => <Layout title="Reset Your Password">{page}</Layout>;

export default ResetPasswordPage;
