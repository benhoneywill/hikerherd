import { z } from "zod";

const movePackCategorySchema = z.object({
  id: z.string(),
  index: z.number(),
});

export default movePackCategorySchema;
