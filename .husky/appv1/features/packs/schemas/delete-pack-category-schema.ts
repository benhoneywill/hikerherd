import { z } from "zod";

const deletePackCategorySchema = z.object({
  id: z.string(),
});

export type DeletePackCategoryValues = z.infer<typeof deletePackCategorySchema>;

export default deletePackCategorySchema;
