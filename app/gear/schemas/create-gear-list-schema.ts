import { z } from "zod";

const createGearListSchema = z.object({
  name: z.string(),
});

export type CreateGearListValues = z.infer<typeof createGearListSchema>;

export default createGearListSchema;
