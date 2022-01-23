import { z } from "zod";

const createPackCategorySchema = z.object({
  packId: z.string(),
  name: z.string(),
});

export type CreatePackCategoryValues = z.infer<typeof createPackCategorySchema>;

export default createPackCategorySchema;
