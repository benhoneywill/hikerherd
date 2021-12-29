import { z } from "zod";

const getGearListSchema = z.object({
  id: z.string(),
});

export type GetGearListValues = z.infer<typeof getGearListSchema>;

export default getGearListSchema;
