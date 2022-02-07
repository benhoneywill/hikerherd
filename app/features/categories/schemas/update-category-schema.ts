import { z } from "zod";

import requiredStringSchema from "app/modules/common/schemas/required-string-schema";

const updateCategorySchema = z.object({
  id: z.string(),
  name: requiredStringSchema(),
});

export default updateCategorySchema;
