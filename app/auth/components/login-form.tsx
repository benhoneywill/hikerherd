import type { FC } from "react";
import type { LoginValues } from "app/auth/schemas/login-schema";

import type { LoginResult } from "app/auth/mutations/login-mutation";

import { AuthenticationError, useMutation } from "blitz";

import TextField from "app/core/components/text-field";
import Form, { FORM_ERROR } from "app/core/components/form";
import loginMutation from "app/auth/mutations/login-mutation";
import loginSchema from "app/auth/schemas/login-schema";

type LoginFormProps = {
  onSuccess?: (user: LoginResult) => void;
};

const LoginForm: FC<LoginFormProps> = ({ onSuccess }) => {
  const [login] = useMutation(loginMutation);

  const initialValues = { email: "", password: "" };

  const handleError = (error: unknown) => {
    if (error instanceof AuthenticationError) {
      return { [FORM_ERROR]: "Sorry, your email or password is incorrect." };
    } else {
      return { [FORM_ERROR]: "Sorry, there was an unexpected error." };
    }
  };

  const handleSubmit = async (values: LoginValues) => {
    try {
      const user = await login(values);
      if (onSuccess) onSuccess(user);
    } catch (error) {
      return handleError(error);
    }
  };

  return (
    <Form
      submitText="Login"
      schema={loginSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <TextField name="email" label="Email" placeholder="Email" />
      <TextField name="password" label="Password" placeholder="Password" type="password" />
    </Form>
  );
};

export default LoginForm;
