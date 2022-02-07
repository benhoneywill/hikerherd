import { z } from "zod";

import requiredStringSchema from "app/modules/common/schemas/required-string-schema";

const createPackCategorySchema = z.object({
  packId: z.string(),
  name: requiredStringSchema(),
});

export default createPackCategorySchema;
