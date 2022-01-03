import { z } from "zod";

const updateGearSchema = z.object({
  id: z.string(),
  name: z.string(),
  weight: z.number(),
  imageUrl: z.string().nullable().default(null),
  link: z.string().nullable().default(null),
  notes: z.string().nullable().default(null),
  consumable: z.boolean().default(false),
  price: z.number().int().nullable().default(null),
});

export type UpdateGearValues = z.infer<typeof updateGearSchema>;

export default updateGearSchema;
