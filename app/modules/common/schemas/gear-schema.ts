import { z } from "zod";

import { Currency } from "db";

import requiredStringSchema from "./required-string-schema";

const gearSchema = z.object({
  name: requiredStringSchema(),
  weight: z.number(),
  imageUrl: z.string().url().nullable().default(null),
  notes: z.string().nullable().default(null),
  consumable: z.boolean().default(false),
  price: z.number().nullable().default(null),
  currency: z.nativeEnum(Currency),
  link: z.string().url().nullable().default(null),
});

export default gearSchema;
