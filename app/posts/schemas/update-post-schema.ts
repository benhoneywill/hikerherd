import { z } from "zod";

import editorContentSchema from "app/common/modules/editor/schemas/editor-content-schema";

const updatePostSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  content: editorContentSchema,
});

export type PostValues = z.infer<typeof updatePostSchema>;

export default updatePostSchema;
