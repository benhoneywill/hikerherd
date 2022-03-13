import { z } from "zod";

import editorContentSchema from "app/components/editor/schemas/editor-content-schema";
import requiredStringSchema from "app/schemas/required-string-schema";

const updatePackSchema = z.object({
  id: z.string(),
  name: requiredStringSchema().min(2),
  notes: editorContentSchema.nullable(),
});

export default updatePackSchema;
