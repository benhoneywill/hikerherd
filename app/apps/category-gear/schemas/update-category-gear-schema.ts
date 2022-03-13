import { z } from "zod";

import gearSchema from "app/apps/gear/schemas/gear-schema";

const updateCategoryGearSchema = gearSchema.extend({
  id: z.string(),
});

export default updateCategoryGearSchema;
