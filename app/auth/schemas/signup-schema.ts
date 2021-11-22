import { z } from "zod";

import passwordSchema from "./password-schema";

const signupSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  username: z
    .string()
    .regex(/[\w.]+/)
    .min(3)
    .max(32),
});

export type SignupValues = z.infer<typeof signupSchema>;

export default signupSchema;
