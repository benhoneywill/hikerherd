import { z } from "zod";

import { CategoryType } from "db";

const inventoryImportSchema = z.object({
  file: z.string(),
  type: z.nativeEnum(CategoryType),
});

export default inventoryImportSchema;
