import { z } from "zod";

import requiredStringSchema from "app/modules/common/schemas/required-string-schema";

const loginSchema = z.object({
  email: requiredStringSchema().email(),
  password: requiredStringSchema().min(1, "Password is required"),
});

export default loginSchema;
