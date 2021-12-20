import { z } from "zod";

const createGearCategorySchema = z.object({
  name: z.string(),
});

export type CreateGearCategoryValues = z.infer<typeof createGearCategorySchema>;

export default createGearCategorySchema;
