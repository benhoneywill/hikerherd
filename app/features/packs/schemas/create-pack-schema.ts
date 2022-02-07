import { z } from "zod";

import editorContentSchema from "app/modules/editor/schemas/editor-content-schema";
import requiredStringSchema from "app/modules/common/schemas/required-string-schema";

const createPackSchema = z.object({
  name: requiredStringSchema().min(2),
  notes: editorContentSchema.nullable(),
});

export default createPackSchema;
