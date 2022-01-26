import { z } from "zod";

import gearSchema from "app/modules/common/schemas/gear-schema";

const updatePackGearSchema = gearSchema.extend({
  id: z.string(),
  worn: z.boolean().default(false),
});

export default updatePackGearSchema;
