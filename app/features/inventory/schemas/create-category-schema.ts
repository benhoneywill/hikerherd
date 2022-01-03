import { z } from "zod";

import { CategoryType } from "db";

const createCategorySchema = z.object({
  type: z.nativeEnum(CategoryType),
  name: z.string(),
});

export type CreateCategoryValues = z.infer<typeof createCategorySchema>;

export default createCategorySchema;
