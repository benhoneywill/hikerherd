import { z } from "zod";

import requiredStringSchema from "app/schemas/required-string-schema";

const updatePackCategorySchema = z.object({
  id: z.string(),
  name: requiredStringSchema(),
});

export default updatePackCategorySchema;
