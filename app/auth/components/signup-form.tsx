import type { FC } from "react";

import { useMutation } from "blitz";

import { TextField } from "app/core/components/text-field";
import { Form, FORM_ERROR } from "app/core/components/form";
import signupMutation from "app/auth/mutations/signup-mutation";
import { SignupSchema } from "app/auth/schemas/signup-schema";

type SignupFormProps = {
  onSuccess?: () => void;
};

export const SignupForm: FC<SignupFormProps> = ({ onSuccess }) => {
  const [signup] = useMutation(signupMutation);

  return (
    <div>
      <h1>Create an Account</h1>

      <Form
        submitText="Create Account"
        schema={SignupSchema}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            await signup(values);
            if (onSuccess) onSuccess();
          } catch (error: any) {
            if (error.code === "P2002") {
              // This error comes from Prisma
              if (error.meta?.target?.includes("email")) {
                return { email: "This email is already being used" };
              }
              if (error.meta?.target?.includes("username")) {
                return { username: "This username is already being used" };
              }
            } else {
              return { [FORM_ERROR]: error.toString() };
            }
          }
        }}
      >
        <TextField name="email" label="Email" placeholder="Email" />
        <TextField name="username" label="Username" placeholder="Username" />
        <TextField name="password" label="Password" placeholder="Password" type="password" />
      </Form>
    </div>
  );
};
