import type { PromiseReturnType } from "blitz";

import { resolver } from "blitz";

import db from "db";

import createCommentSchema from "../schemas/create-comment-schema";

const createCommentMutation = resolver.pipe(
  resolver.zod(createCommentSchema),
  resolver.authorize(),

  async ({ parentPostId, parentCommentId, content }, ctx) => {
    return db.comment.create({
      data: {
        parentPostId,
        parentCommentId,
        content: JSON.stringify(content),
        authorId: ctx.session.userId,
      },
    });
  }
);

export type CreateCommentResult = PromiseReturnType<typeof createCommentMutation>;

export default createCommentMutation;
