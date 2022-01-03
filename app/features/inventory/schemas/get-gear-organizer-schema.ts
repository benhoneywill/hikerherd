import { z } from "zod";

import { CategoryType } from "db";

const getGearOrganizerSchema = z.object({
  type: z.nativeEnum(CategoryType),
});

export type GetGearOrganizerValues = z.infer<typeof getGearOrganizerSchema>;

export default getGearOrganizerSchema;
