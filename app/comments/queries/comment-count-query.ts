import type { PromiseReturnType } from "blitz";

import { resolver } from "blitz";

import db from "db";

import getCommentCountSchema from "../schemas/get-comment-count-schema";

const commentCountQuery = resolver.pipe(
  resolver.zod(getCommentCountSchema),

  async ({ rootId, rootType }) => {
    return db.comment.count({ where: { rootId, rootType } });
  }
);

export type CommentsResult = PromiseReturnType<typeof commentCountQuery>;

export default commentCountQuery;
