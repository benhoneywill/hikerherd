import { z } from "zod";

const getMyBlogPostSchema = z.object({
  slug: z.string(),
});

export type GetMyBlogPostValues = z.infer<typeof getMyBlogPostSchema>;

export default getMyBlogPostSchema;
