import { z } from "zod";

import { CategoryType } from "db";

const listCategoryGearSchema = z.object({
  type: z.nativeEnum(CategoryType),
});

export default listCategoryGearSchema;
