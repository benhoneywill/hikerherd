import { z } from "zod";

import editorContentSchema from "app/common/modules/editor/schemas/editor-content-schema";

const createBlogPostSchema = z.object({
  blogId: z.string(),
  title: z.string().min(3),
  content: editorContentSchema,
});

export type CreateBlogPostValues = z.infer<typeof createBlogPostSchema>;

export default createBlogPostSchema;
