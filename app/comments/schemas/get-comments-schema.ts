import { z } from "zod";

import paginationSchema from "app/core/schemas/pagination-schema";

import { CommentRootType } from "db";

const getCommentsSchema = paginationSchema.merge(
  z.object({
    rootId: z.string(),
    rootType: z.nativeEnum(CommentRootType),
    parentId: z.union([z.string(), z.null()]).default(null),
    depth: z.number().positive().default(3),
  })
);

export type GetCommentsParams = z.infer<typeof getCommentsSchema>;

export default getCommentsSchema;
