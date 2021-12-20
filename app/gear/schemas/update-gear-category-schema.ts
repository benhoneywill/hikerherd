import { z } from "zod";

const updateGearCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type UpdateGearCategoryValues = z.infer<typeof updateGearCategorySchema>;

export default updateGearCategorySchema;
