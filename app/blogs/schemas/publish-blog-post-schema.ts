import { z } from "zod";

const publishBlogPostSchema = z.object({
  id: z.string(),
});

export type PublishBlogPostValues = z.infer<typeof publishBlogPostSchema>;

export default publishBlogPostSchema;
