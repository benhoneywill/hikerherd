import { z } from "zod";

import passwordSchema from "./password-schema";

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: passwordSchema,
});

export default changePasswordSchema;
