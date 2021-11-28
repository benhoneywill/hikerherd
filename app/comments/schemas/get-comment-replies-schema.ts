import { z } from "zod";

import paginationSchema from "app/core/schemas/pagination-schema";

const getCommentRepliesSchema = paginationSchema.merge(
  z.object({
    id: z.number().positive(),
  })
);

export type GetCommentRepliesParams = z.infer<typeof getCommentRepliesSchema>;

export default getCommentRepliesSchema;
