import { z } from "zod";

const updateGearListSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type UpdateGearListValues = z.infer<typeof updateGearListSchema>;

export default updateGearListSchema;
