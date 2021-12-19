import { z } from "zod";

import editorContentSchema from "app/common/modules/editor/schemas/editor-content-schema";

const updateBlogPostSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  content: editorContentSchema,
});

export type UpdateBlogPostValues = z.infer<typeof updateBlogPostSchema>;

export default updateBlogPostSchema;
