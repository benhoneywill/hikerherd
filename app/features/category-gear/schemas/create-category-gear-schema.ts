import { z } from "zod";

import gearSchema from "app/modules/common/schemas/gear-schema";

const createCategoryGearSchema = gearSchema.extend({
  categoryId: z.string(),
});

export default createCategoryGearSchema;
