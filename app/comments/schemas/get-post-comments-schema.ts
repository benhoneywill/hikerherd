import { z } from "zod";

import paginationSchema from "app/core/schemas/pagination-schema";

const getPostCommentsSchema = paginationSchema.merge(
  z.object({
    id: z.number().positive(),
  })
);

export type GetPostCommentsParams = z.infer<typeof getPostCommentsSchema>;

export default getPostCommentsSchema;
