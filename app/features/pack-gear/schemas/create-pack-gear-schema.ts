import { z } from "zod";

import gearSchema from "app/modules/common/schemas/gear-schema";

const createPackGearSchema = gearSchema.extend({
  packId: z.string(),
  categoryId: z.string(),
  worn: z.boolean().default(false),
});

export default createPackGearSchema;
