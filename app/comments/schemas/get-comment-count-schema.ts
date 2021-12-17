import { z } from "zod";

import paginationSchema from "app/common/schemas/pagination-schema";

import { CommentRootType } from "db";

const getCommentCountSchema = paginationSchema.merge(
  z.object({
    rootId: z.string(),
    rootType: z.nativeEnum(CommentRootType),
  })
);

export type GetCommentCountParams = z.infer<typeof getCommentCountSchema>;

export default getCommentCountSchema;
