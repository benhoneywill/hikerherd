import { z } from "zod";

import requiredStringSchema from "app/modules/common/schemas/required-string-schema";

const forgotPasswordSchema = z.object({
  email: requiredStringSchema().email(),
});

export default forgotPasswordSchema;
