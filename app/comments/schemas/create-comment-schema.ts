import { z } from "zod";

import editorContentSchema from "app/editor/schemas/editor-content-schema";

import { CommentRootType } from "db";

const createCommentSchema = z.object({
  rootId: z.string(),
  rootType: z.nativeEnum(CommentRootType),
  parentId: z.string().optional(),
  content: editorContentSchema,
});

export type CreateCommentValues = z.infer<typeof createCommentSchema>;

export default createCommentSchema;
