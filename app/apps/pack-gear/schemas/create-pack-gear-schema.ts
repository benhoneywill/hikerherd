import { z } from "zod";

import gearSchema from "app/apps/gear/schemas/gear-schema";

const createPackGearSchema = gearSchema.extend({
  categoryId: z.string(),
  worn: z.boolean().default(false),
});

export default createPackGearSchema;
