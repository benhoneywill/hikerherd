import type { PromiseReturnType } from "blitz";

import { paginate, resolver } from "blitz";

import db from "db";

import getCommentRepliesSchema from "../schemas/get-comment-replies-schema";

const commentRepliesQuery = resolver.pipe(
  resolver.zod(getCommentRepliesSchema),

  async ({ id, skip, take }) => {
    const where = { parentCommentId: id };

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

export type CommentRepliesResult = PromiseReturnType<typeof commentRepliesQuery>;

export default commentRepliesQuery;
