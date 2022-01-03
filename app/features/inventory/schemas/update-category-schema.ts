import { z } from "zod";

const updateCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type UpdateCategoryValues = z.infer<typeof updateCategorySchema>;

export default updateCategorySchema;
