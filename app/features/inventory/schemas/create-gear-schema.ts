import { CategoryType } from "@prisma/client";
import { z } from "zod";

const createGearSchema = z.object({
  type: z.nativeEnum(CategoryType),
  name: z.string(),
  categoryId: z.string(),
  weight: z.number(),
  imageUrl: z.string().nullable().default(null),
  link: z.string().nullable().default(null),
  notes: z.string().nullable().default(null),
  consumable: z.boolean().default(false),
  price: z.number().int().nullable().default(null),
});

export type CreateGearValues = z.infer<typeof createGearSchema>;

export default createGearSchema;
