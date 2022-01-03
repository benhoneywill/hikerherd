import type { FC } from "react";
import type { LoginValues } from "../schemas/login-schema";
import type { LoginResult } from "../mutations/login-mutation";

import { AuthenticationError, useMutation } from "blitz";

import { Stack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";

import TextField from "app/common/components/text-field";
import Form, { FORM_ERROR } from "app/common/components/form";

import loginMutation from "../mutations/login-mutation";
import loginSchema from "../schemas/login-schema";

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
      schema={loginSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      render={(form) => (
        <Stack spacing={6}>
          <Stack spacing={4}>
            <TextField
              name="email"
              label="Email address"
              placeholder="Enter your email address"
              size="lg"
            />
            <TextField
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              size="lg"
            />
          </Stack>

          <Button
            size="lg"
            colorScheme="green"
            isLoading={form.submitting}
            type="submit"
          >
            Log in
          </Button>
        </Stack>
      )}
    ></Form>
  );
};

export default LoginForm;
