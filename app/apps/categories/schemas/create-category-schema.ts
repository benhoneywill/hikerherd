import { z } from "zod";

import requiredStringSchema from "app/schemas/required-string-schema";

import { CategoryType } from "db";

const createCategorySchema = z.object({
  type: z.nativeEnum(CategoryType),
  name: requiredStringSchema(),
});

export default createCategorySchema;
