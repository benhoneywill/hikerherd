import type { Ctx } from "blitz";

import { NotFoundError } from "blitz";

import { AuthenticationError } from "blitz";

import db from "db";

type MyPostOptions = {
  id: number;
};

const myPostQuery = async ({ id }: MyPostOptions, ctx: Ctx) => {
  if (!ctx.session.userId) {
    throw new AuthenticationError();
  }

  const post = await db.post.findUnique({
    where: { id },
  });

  if (!post || post.authorId !== ctx.session.userId) {
    throw new NotFoundError();
  }

  return post;
};

export default myPostQuery;
