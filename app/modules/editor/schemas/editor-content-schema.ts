import { z } from "zod";

import jsonSchema from "app/modules/common/schemas/json-schema";

const editorContentSchema = z.object({
  type: z.string(),
  content: z.array(jsonSchema),
});

export default editorContentSchema;
