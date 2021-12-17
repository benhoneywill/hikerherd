import type { PromiseReturnType } from "blitz";

import { resolver } from "blitz";

import db from "db";

import threadedCommentInclude from "../helpers/threaded-comment-include";
import createCommentSchema from "../schemas/create-comment-schema";

const createCommentMutation = resolver.pipe(
  resolver.zod(createCommentSchema),
  resolver.authorize(),

  async ({ rootId, rootType, parentId, content }, ctx) => {
    return db.comment.create({
      data: {
        rootId,
        rootType,
        parentId,
        content: JSON.stringify(content),
        authorId: ctx.session.userId,
      },
      include: threadedCommentInclude({ depth: 0 }),
    });
  }
);

export type CreateCommentResult = PromiseReturnType<
  typeof createCommentMutation
>;

export default createCommentMutation;
