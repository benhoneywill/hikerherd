import { z } from "zod";

import { JsonSchema } from "app/core/schemas/json-schema";

export const UpdatePostSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: JsonSchema,
  publish: z.boolean(),
});
