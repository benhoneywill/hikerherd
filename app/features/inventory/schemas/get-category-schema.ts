import { z } from "zod";

const getCategorySchema = z.object({
  id: z.string(),
});

export type GetCategoryValues = z.infer<typeof getCategorySchema>;

export default getCategorySchema;
