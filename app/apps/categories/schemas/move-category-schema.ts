import { z } from "zod";

const moveCategorySchema = z.object({
  id: z.string(),
  index: z.number(),
});

export default moveCategorySchema;
