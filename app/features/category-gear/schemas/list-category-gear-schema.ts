import { z } from "zod";

import { CategoryType } from "db";

const listCategoryGearQuery = z.object({
  type: z.nativeEnum(CategoryType),
});

export default listCategoryGearQuery;
