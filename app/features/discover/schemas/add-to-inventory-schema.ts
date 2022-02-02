import { z } from "zod";

const addToInventorySchema = z.object({
  gearId: z.string(),
  categoryId: z.string(),
});

export default addToInventorySchema;
