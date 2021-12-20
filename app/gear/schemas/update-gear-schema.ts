import { z } from "zod";

const updateGearSchema = z.object({
  id: z.string(),
  name: z.string(),
  categoryId: z.string().optional(),
  weight: z.number(),
});

export type UpdateGearValues = z.infer<typeof updateGearSchema>;

export default updateGearSchema;
