import { z } from "zod";

import editorContentSchema from "app/editor/schemas/editor-content-schema";

const createPostSchema = z.object({
  title: z.string().min(3),
  content: editorContentSchema,
});

export type CreatePostValues = z.infer<typeof createPostSchema>;

export default createPostSchema;
