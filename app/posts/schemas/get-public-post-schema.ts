import { z } from "zod";

const getPublicPostSchema = z.object({
  slug: z.string(),
});

export type GetPublicPostParams = z.infer<typeof getPublicPostSchema>;

export default getPublicPostSchema;
