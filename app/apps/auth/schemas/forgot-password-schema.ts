import { z } from "zod";

import requiredStringSchema from "app/schemas/required-string-schema";

const forgotPasswordSchema = z.object({
  email: requiredStringSchema().email(),
});

export default forgotPasswordSchema;
