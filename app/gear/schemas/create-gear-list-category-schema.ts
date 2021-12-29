import { z } from "zod";

const createGearListCategorySchema = z.object({
  listId: z.string(),
  name: z.string(),
});

export type CreateGearListCategoryValues = z.infer<
  typeof createGearListCategorySchema
>;

export default createGearListCategorySchema;
