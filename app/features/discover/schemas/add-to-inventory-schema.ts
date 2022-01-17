import { CategoryType } from "@prisma/client";
import { z } from "zod";

const addToInventorySchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  type: z.nativeEnum(CategoryType),
});

export type AddToInventoryValues = z.infer<typeof addToInventorySchema>;

export default addToInventorySchema;
