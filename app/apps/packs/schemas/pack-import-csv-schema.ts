import { z } from "zod";

const packImportCsvSchema = z.object({
  id: z.string(),
  file: z.string(),
  addToInventory: z.boolean().default(false),
});

export default packImportCsvSchema;
