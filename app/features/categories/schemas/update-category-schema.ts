import { z } from "zod";

const updateCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export default updateCategorySchema;
