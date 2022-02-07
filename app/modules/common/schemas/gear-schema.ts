import { z } from "zod";

import { Currency } from "db";

import requiredStringSchema from "./required-string-schema";

const gearSchema = z.object({
  name: requiredStringSchema(),
  weight: z.number(),
  imageUrl: z.string().nullable().default(null),
  link: z.string().nullable().default(null),
  notes: z.string().nullable().default(null),
  consumable: z.boolean().default(false),
  price: z.number().nullable().default(null),
  currency: z.nativeEnum(Currency),
});

export default gearSchema;
