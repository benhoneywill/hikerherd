import { z } from "zod";

import editorContentSchema from "app/modules/editor/schemas/editor-content-schema";

const createPackSchema = z.object({
  name: z.string().min(2),
  notes: editorContentSchema.nullable(),
});

export default createPackSchema;
