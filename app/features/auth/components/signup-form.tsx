import type { FC } from "react";
import type { SignupValues } from "../schemas/signup-schema";
import type { SignupResult } from "../mutations/signup-mutation";

import { useMutation } from "blitz";

import { Button, Stack } from "@chakra-ui/react";

import TextField from "app/common/components/text-field";
import Form, { FORM_ERROR } from "app/common/components/form";

import signupMutation from "../mutations/signup-mutation";
import signupSchema from "../schemas/signup-schema";
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
      schema={signupSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      render={(form) => (
        <Stack spacing={8}>
          <Stack spacing={4}>
            <TextField
              name="email"
              label="Email address"
              placeholder="Enter your email address"
              size="lg"
            />
            <TextField
              name="username"
              label="Username"
              placeholder="Pick an online trail-name"
              size="lg"
            />
            <TextField
              name="password"
              label="Password"
              placeholder="Choose a secure password"
              type="password"
              size="lg"
            />
          </Stack>

          <Button
            mt={3}
            isLoading={form.submitting}
            size="lg"
            colorScheme="green"
            type="submit"
          >
            Join hikerherd
          </Button>
        </Stack>
      )}
    />
  );
};

export default SignupForm;
