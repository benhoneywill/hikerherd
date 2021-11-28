import { z } from "zod";

import JsonSchema from "app/core/schemas/json-schema";

const createCommentSchema = z.object({
  parentPostId: z.number().positive(),
  parentCommentId: z.number().positive().optional(),
  content: JsonSchema,
});

export type CreateCommentValues = z.infer<typeof createCommentSchema>;

export default createCommentSchema;
