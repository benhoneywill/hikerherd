import { z } from "zod";

const getPackCategorySchema = z.object({
  id: z.string(),
});

export type GetPackCategoryValues = z.infer<typeof getPackCategorySchema>;

export default getPackCategorySchema;
