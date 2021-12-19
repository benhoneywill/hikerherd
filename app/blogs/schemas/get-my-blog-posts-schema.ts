import { z } from "zod";

import paginationSchema from "app/common/schemas/pagination-schema";

const getMyBlogPostsSchema = paginationSchema.extend({
  slug: z.string(),
});

export type GetMyBlogPostsValues = z.infer<typeof getMyBlogPostsSchema>;

export default getMyBlogPostsSchema;
