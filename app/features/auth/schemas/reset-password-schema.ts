import { z } from "zod";

import passwordSchema from "./password-schema";

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    passwordConfirmation: passwordSchema,
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default resetPasswordSchema;
