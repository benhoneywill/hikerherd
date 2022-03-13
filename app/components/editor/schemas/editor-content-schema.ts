import { z } from "zod";

import jsonSchema from "app/schemas/json-schema";

const editorContentSchema = z.object({
  type: z.string(),
  content: z.array(jsonSchema),
});

export default editorContentSchema;
