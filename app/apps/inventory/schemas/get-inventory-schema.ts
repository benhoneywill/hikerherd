import { z } from "zod";

import { CategoryType } from "db";

const getInventorySchema = z.object({
  type: z.nativeEnum(CategoryType),
});

export default getInventorySchema;
