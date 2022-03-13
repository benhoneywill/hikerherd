import { z } from "zod";

import requiredStringSchema from "app/schemas/required-string-schema";

import passwordSchema from "./password-schema";

const changePasswordSchema = z.object({
  currentPassword: requiredStringSchema(),
  newPassword: passwordSchema,
});

export default changePasswordSchema;
