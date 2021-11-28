import { z } from "zod";

import JsonSchema from "app/core/schemas/json-schema";

const updatePostSchema = z.object({
  id: z.number().positive(),
  title: z.string().min(3),
  content: JsonSchema,
});

export type PostValues = z.infer<typeof updatePostSchema>;

export default updatePostSchema;
