import { z } from "zod";

import editorContentSchema from "app/modules/editor/schemas/editor-content-schema";

const updatePackSchema = z.object({
  id: z.string(),
  name: z.string(),
  notes: editorContentSchema.nullable(),
});

export type UpdatePackValues = z.infer<typeof updatePackSchema>;

export default updatePackSchema;
