import { z } from "zod";

const updatePackCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type UpdatePackCategoryValues = z.infer<typeof updatePackCategorySchema>;

export default updatePackCategorySchema;
