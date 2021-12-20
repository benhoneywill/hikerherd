import { z } from "zod";

const moveGearSchema = z.object({
  id: z.string(),
  categoryId: z.string().optional().nullable(),
  index: z.number(),
});

export type MoveGearValues = z.infer<typeof moveGearSchema>;

export default moveGearSchema;
