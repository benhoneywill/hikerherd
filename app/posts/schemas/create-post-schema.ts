import { z } from "zod";

import JsonSchema from "app/core/schemas/json-schema";

const createPostSchema = z.object({
  title: z.string().min(3),
  content: JsonSchema,
});

export type CreatePostValues = z.infer<typeof createPostSchema>;

export default createPostSchema;
