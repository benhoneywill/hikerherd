import type { PromiseReturnType } from "blitz";

import { paginate, resolver } from "blitz";

import db from "db";

import threadedCommentInclude from "../helpers/threaded-comment-include";
import getCommentsSchema from "../schemas/get-comments-schema";

const commentsQuery = resolver.pipe(
  resolver.zod(getCommentsSchema),

  async ({ rootId, rootType, parentId, depth, skip, take }) => {
    const where = { rootId, rootType, parentId };

    const result = await paginate({
      skip,
      take,
      count: () => db.comment.count({ where }),
      query: (paginateArgs) => {
        return db.comment.findMany({
          ...paginateArgs,
          where,
          orderBy: { createdAt: "asc" },
          include: threadedCommentInclude({ depth }),
        });
      },
    });

    return result;
  }
);

export type CommentsResult = PromiseReturnType<typeof commentsQuery> & {
  items: Array<
    PromiseReturnType<typeof commentsQuery>["items"][number] & {
      replies?: CommentsResult["items"][number][];
    }
  >;
};

export type CommentsResultItem = CommentsResult["items"][number];

export default commentsQuery;
