import { z } from "zod";

const deleteCategorySchema = z.object({
  id: z.string(),
});

export type DeleteCategoryValues = z.infer<typeof deleteCategorySchema>;

export default deleteCategorySchema;
