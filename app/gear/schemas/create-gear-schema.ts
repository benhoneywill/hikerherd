import { z } from "zod";

const createGearSchema = z.object({
  name: z.string(),
  categoryId: z.string().optional(),
  weight: z.number(),
});

export type CreateGearValues = z.infer<typeof createGearSchema>;

export default createGearSchema;
