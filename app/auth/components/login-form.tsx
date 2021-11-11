import type { PromiseReturnType } from "blitz";

import { AuthenticationError, Link, useMutation, Routes } from "blitz";

import { TextField } from "app/core/components/text-field";
import { Form, FORM_ERROR } from "app/core/components/form";
import loginMutation from "app/auth/mutations/login-mutation";
import { LoginSchema } from "app/auth/schemas/login-schema";

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof loginMutation>) => void;
};

export const LoginForm: FC<LoginFormProps> = ({ onSuccess }) => {
  const [login] = useMutation(loginMutation);

  return (
    <div>
      <h1>Login</h1>

      <Form
        submitText="Login"
        schema={LoginSchema}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            const user = await login(values);
            if (onSuccess) onSuccess(user);
          } catch (error: any) {
            if (error instanceof AuthenticationError) {
              return { [FORM_ERROR]: "Sorry, your email or password is incorrect" };
            } else {
              return {
                [FORM_ERROR]:
                  "Sorry, there was an unexpected error. Please try again. - " + error.toString(),
              };
            }
          }
        }}
      >
        <TextField name="email" label="Email" placeholder="Email" />
        <TextField name="password" label="Password" placeholder="Password" type="password" />
      </Form>

      <div>
        <Link href={Routes.ForgotPasswordPage()}>
          <a>Forgot your password?</a>
        </Link>
        Or
        <Link href={Routes.SignupPage()}>Sign Up</Link>
      </div>
    </div>
  );
};
