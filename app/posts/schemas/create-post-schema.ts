import { z } from "zod";

import { JsonSchema } from "app/core/schemas/json-schema";

export const CreatePostSchema = z.object({
  title: z.string(),
  content: JsonSchema,
  publish: z.boolean(),
});
