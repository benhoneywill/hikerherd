import { z } from "zod";

import { Currency } from "db";

const createPackGearSchema = z.object({
  name: z.string(),
  packId: z.string(),
  categoryId: z.string(),
  weight: z.number(),
  imageUrl: z.string().nullable().default(null),
  link: z.string().nullable().default(null),
  notes: z.string().nullable().default(null),
  consumable: z.boolean().default(false),
  worn: z.boolean().default(false),
  price: z.number().int().nullable().default(null),
  currency: z.nativeEnum(Currency),
});

export type CreatePackGearValues = z.infer<typeof createPackGearSchema>;

export default createPackGearSchema;
