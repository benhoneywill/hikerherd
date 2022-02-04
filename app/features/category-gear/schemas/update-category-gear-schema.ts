import { z } from "zod";

import gearSchema from "app/modules/common/schemas/gear-schema";

const updateCategoryGearSchema = gearSchema.extend({
  id: z.string(),
});

export default updateCategoryGearSchema;
