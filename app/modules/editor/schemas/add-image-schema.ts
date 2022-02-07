import { z } from "zod";

import requiredStringSchema from "app/modules/common/schemas/required-string-schema";

const addImageSchema = z.object({
  image: requiredStringSchema(),
});

export default addImageSchema;
