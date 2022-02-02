import { z } from "zod";

import { CategoryType } from "db";

const createCategorySchema = z.object({
  type: z.nativeEnum(CategoryType),
  name: z.string(),
});

export default createCategorySchema;
