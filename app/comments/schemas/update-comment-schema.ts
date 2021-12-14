import { z } from "zod";

import editorContentSchema from "app/editor/schemas/editor-content-schema";

const updateCommentSchema = z.object({
  id: z.string(),
  content: editorContentSchema,
});

export type UpdateCommentValues = z.infer<typeof updateCommentSchema>;

export default updateCommentSchema;
