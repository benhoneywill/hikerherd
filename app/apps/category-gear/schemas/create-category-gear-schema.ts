import { z } from "zod";

import gearSchema from "app/apps/gear/schemas/gear-schema";

const createCategoryGearSchema = gearSchema.extend({
  categoryId: z.string(),
});

export default createCategoryGearSchema;
