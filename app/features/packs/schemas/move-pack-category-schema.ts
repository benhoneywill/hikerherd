import { z } from "zod";

const movePackCategorySchema = z.object({
  id: z.string(),
  index: z.number(),
});

export type MovePackCategoryValues = z.infer<typeof movePackCategorySchema>;

export default movePackCategorySchema;
