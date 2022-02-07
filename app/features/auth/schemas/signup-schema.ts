import { z } from "zod";

import requiredStringSchema from "app/modules/common/schemas/required-string-schema";

import passwordSchema from "./password-schema";

const signupSchema = z.object({
  email: requiredStringSchema().email(),
  password: passwordSchema,
  username: requiredStringSchema()
    .min(3)
    .max(32)
    .regex(
      /^[\w.]+$/,
      "Can only contain letters, numbers, underscores and periods"
    ),
});

export default signupSchema;
