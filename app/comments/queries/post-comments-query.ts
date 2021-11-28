import type { PromiseReturnType } from "blitz";

import { paginate, resolver } from "blitz";

import db from "db";

import getPostCommentsSchema from "../schemas/get-post-comments-schema";

const postCommentsQuery = resolver.pipe(
  resolver.zod(getPostCommentsSchema),

  async ({ id, skip, take }) => {
    const where = { parentPostId: id, parentCommentId: null };

    const result = await paginate({
      skip,
      take,
      count: () => db.comment.count({ where }),
      query: (paginateArgs) => {
        return db.comment.findMany({
          ...paginateArgs,
          where,
          orderBy: { createdAt: "asc" },
          include: {
            author: true,
          },
        });
      },
    });

    return result;
  }
);

export type PostCommentsResult = PromiseReturnType<typeof postCommentsQuery>;

export default postCommentsQuery;
