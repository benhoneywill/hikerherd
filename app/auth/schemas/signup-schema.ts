import { z } from "zod";

import { passwordSchema } from "./password-schema";

export const SignupSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  username: z
    .string()
    .regex(/[\w\.]+/)
    .min(3)
    .max(32),
});
