import { z } from "zod";

import { Currency, GearType } from "db";

const createGearSchema = z.object({
  name: z.string(),
  categoryId: z.string(),
  weight: z.number(),
  imageUrl: z.string().nullable().default(null),
  link: z.string().nullable().default(null),
  notes: z.string().nullable().default(null),
  consumable: z.boolean().default(false),
  price: z.number().int().nullable().default(null),
  currency: z.nativeEnum(Currency),
  type: z.nativeEnum(GearType).nullable().default(null),
});

export type CreateGearValues = z.infer<typeof createGearSchema>;

export default createGearSchema;
