import { z } from "zod";

import { CategoryType } from "db";

const inventoryImportSchema = z.object({
  file: z.any(),
  type: z.nativeEnum(CategoryType),
});

export default inventoryImportSchema;
