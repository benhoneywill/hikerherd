import { z } from "zod";

const updatePackCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export default updatePackCategorySchema;
