import { z } from "zod";

import { CategoryType } from "db";

const getInventoryItemsSchema = z.object({
  type: z.nativeEnum(CategoryType),
});

export type GetInventoryItemsValues = z.infer<typeof getInventoryItemsSchema>;

export default getInventoryItemsSchema;
