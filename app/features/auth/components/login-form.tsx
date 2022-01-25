import type { FC } from "react";
import type { PromiseReturnType } from "blitz";

import { Fragment } from "react";
import { AuthenticationError, useMutation } from "blitz";

import { FORM_ERROR } from "final-form";

import TextField from "app/modules/forms/components/text-field";
import SimpleForm from "app/modules/forms/components/simple-form";

import loginMutation from "../mutations/login-mutation";
import loginSchema from "../schemas/login-schema";

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof loginMutation>) => void;
};

const LoginForm: FC<LoginFormProps> = ({ onSuccess }) => {
  const [login] = useMutation(loginMutation);

  const handleError = (error: unknown) => {
    if (error instanceof AuthenticationError) {
      return {
        [FORM_ERROR]: "Wrong email or password. Please check and try again.",
      };
    } else {
      return {
        [FORM_ERROR]:
          "Oops! Something went wrong logging you in. Please try again.",
      };
    }
  };

  return (
    <SimpleForm
      schema={loginSchema}
      initialValues={{ email: "", password: "" }}
      submitText="Log in"
      large
      onSubmit={async (values) => {
        try {
          const user = await login(values);
          if (onSuccess) onSuccess(user);
        } catch (error) {
          return handleError(error);
        }
      }}
      render={() => (
        <Fragment>
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
        </Fragment>
      )}
    />
  );
};

export default LoginForm;
