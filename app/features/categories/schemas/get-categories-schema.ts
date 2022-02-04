import { z } from "zod";

import { CategoryType } from "db";

const getCategoriesSchema = z.object({
  type: z.nativeEnum(CategoryType),
});

export default getCategoriesSchema;
