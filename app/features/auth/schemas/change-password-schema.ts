import { z } from "zod";

import passwordSchema from "./password-schema";

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: passwordSchema,
});

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export default changePasswordSchema;
