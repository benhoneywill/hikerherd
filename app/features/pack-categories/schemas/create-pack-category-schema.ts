import { z } from "zod";

const createPackCategorySchema = z.object({
  packId: z.string(),
  name: z.string(),
});

export default createPackCategorySchema;
