import { z } from "zod";

const moveCategorySchema = z.object({
  id: z.string(),
  index: z.number(),
});

export type MoveCategoryValues = z.infer<typeof moveCategorySchema>;

export default moveCategorySchema;
