import type { PromiseReturnType } from "blitz";

import { NotFoundError, AuthorizationError, resolver } from "blitz";

import db from "db";

import getMyPostSchema from "../schemas/get-my-post-schema";

const myPostQuery = resolver.pipe(
  resolver.zod(getMyPostSchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    const post = await db.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundError();
    }

    if (post.authorId !== ctx.session.userId) {
      throw new AuthorizationError();
    }

    return post;
  }
);

export type MyPostResult = PromiseReturnType<typeof myPostQuery>;

export default myPostQuery;
