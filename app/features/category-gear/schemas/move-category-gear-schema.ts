import { z } from "zod";

const moveCateoryGearSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  index: z.number(),
});

export default moveCateoryGearSchema;
