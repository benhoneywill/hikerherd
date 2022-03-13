import { z } from "zod";

import editorContentSchema from "app/components/editor/schemas/editor-content-schema";
import requiredStringSchema from "app/schemas/required-string-schema";

const createPackSchema = z.object({
  name: requiredStringSchema().min(2),
  notes: editorContentSchema.nullable(),
  private: z.boolean(),
});

export default createPackSchema;
