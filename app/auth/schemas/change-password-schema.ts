import { z } from "zod";

import { passwordSchema } from "./password-schema";

export const ChangePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: passwordSchema,
});
