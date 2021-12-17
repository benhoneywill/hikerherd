import { z } from "zod";

const createBlogSchema = z.object({
  name: z.string().min(3),
});

export type CreateBlogValues = z.infer<typeof createBlogSchema>;

export default createBlogSchema;
