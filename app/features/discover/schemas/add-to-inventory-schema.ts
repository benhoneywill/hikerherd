import { z } from "zod";

import { CategoryType } from "db";

const addToInventorySchema = z.object({
  gearId: z.string(),
  categoryId: z.string(),
  type: z.nativeEnum(CategoryType),
});

export default addToInventorySchema;
