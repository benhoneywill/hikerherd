import { z } from "zod";

const getCategoryItemSchema = z.object({
  id: z.string(),
});

export type GetCategoryValues = z.infer<typeof getCategoryItemSchema>;

export default getCategoryItemSchema;
