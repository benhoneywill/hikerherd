import type { FC } from "react";
import type { SignupValues } from "app/auth/schemas/signup-schema";
import type { SignupResult } from "app/auth/mutations/signup-mutation";

import { useMutation } from "blitz";

import TextField from "app/core/components/text-field";
import Form, { FORM_ERROR } from "app/core/components/form";
import signupMutation from "app/auth/mutations/signup-mutation";
import signupSchema from "app/auth/schemas/signup-schema";

import UserCreateError from "../errors/user-create-error";

type SignupFormProps = {
  onSuccess?: (user: SignupResult) => void;
};

const SignupForm: FC<SignupFormProps> = ({ onSuccess }) => {
  const [signup] = useMutation(signupMutation);

  const initialValues = { email: "", password: "" };

  const handleError = (error: unknown) => {
    if (error instanceof UserCreateError && error.emailTaken) {
      return { email: "This email is already being used" };
    }

    if (error instanceof UserCreateError && error.usernameTaken) {
      return { username: "This username is already being used" };
    }

    if (error instanceof Error) {
      return { [FORM_ERROR]: error.message };
    }

    return { [FORM_ERROR]: "There was an unexpected error" };
  };

  const handleSubmit = async (values: SignupValues) => {
    try {
      const result = await signup(values);
      if (onSuccess) onSuccess(result);
    } catch (error) {
      return handleError(error);
    }
  };

  return (
    <Form
      submitText="Join the herd"
      schema={signupSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <TextField name="email" label="Email" placeholder="Email" />
      <TextField name="username" label="Username" placeholder="Username" />
      <TextField name="password" label="Password" placeholder="Password" type="password" />
    </Form>
  );
};

export default SignupForm;
