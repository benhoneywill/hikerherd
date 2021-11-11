import { z } from "zod";

import { passwordSchema } from "./password-schema";

export const ResetPasswordSchema = z
  .object({
    password: passwordSchema,
    passwordConfirmation: passwordSchema,
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });
