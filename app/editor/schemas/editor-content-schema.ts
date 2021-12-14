import { z } from "zod";

import jsonSchema from "app/core/schemas/json-schema";

const editorContentSchema = z.object({
  type: z.string(),
  content: z.array(jsonSchema),
});

export type editorContentValues = z.infer<typeof editorContentSchema>;

export default editorContentSchema;
