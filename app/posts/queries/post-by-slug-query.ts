import type { Ctx } from "blitz";

import { NotFoundError, AuthorizationError } from "blitz";

import db from "db";

type PostBySlugOptions = {
  slug: string;
};

const postBySlugQuery = async ({ slug }: PostBySlugOptions, { session }: Ctx) => {
  const post = await db.post.findUnique({
    where: { slug },
  });

  if (!post) {
    throw new NotFoundError();
  }

  const isPublished = !!post.publishedAt && post.publishedAt < new Date();
  const isAuthor = post.authorId === session.userId;

  if (isPublished || isAuthor) {
    return post;
  } else {
    throw new AuthorizationError();
  }
};

export default postBySlugQuery;
