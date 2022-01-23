import { z } from "zod";

const movePackGearSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  packId: z.string(),
  index: z.number(),
});

export default movePackGearSchema;
