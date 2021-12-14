import type { PromiseReturnType } from "blitz";

import { AuthorizationError, NotFoundError } from "blitz";
import { resolver } from "blitz";

import db from "db";

import threadedCommentInclude from "../helpers/threaded-comment-include";
import updateCommentSchema from "../schemas/update-comment-schema";

const updateCommentMutation = resolver.pipe(
  resolver.zod(updateCommentSchema),
  resolver.authorize(),

  async ({ id, content }, ctx) => {
    const comment = await db.comment.findUnique({ where: { id } });

    if (!comment) {
      throw new NotFoundError();
    }

    if (comment.authorId !== ctx.session.userId) {
      throw new AuthorizationError();
    }

    return db.comment.update({
      where: { id },
      data: {
        content: JSON.stringify(content),
      },
      include: threadedCommentInclude({ depth: 0 }),
    });
  }
);

export type UpdateCommentResult = PromiseReturnType<typeof updateCommentMutation>;

export default updateCommentMutation;
