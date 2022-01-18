import { z } from "zod";

import { Currency, GearType } from "db";

const updateGearSchema = z.object({
  id: z.string(),
  name: z.string(),
  weight: z.number(),
  consumable: z.boolean(),
  imageUrl: z.string().nullable().default(null),
  link: z.string().nullable().default(null),
  notes: z.string().nullable().default(null),
  price: z.number().int().nullable().default(null),
  currency: z.nativeEnum(Currency),
  type: z.nativeEnum(GearType).nullable().default(null),
});

export type UpdateGearValues = z.infer<typeof updateGearSchema>;

export default updateGearSchema;
