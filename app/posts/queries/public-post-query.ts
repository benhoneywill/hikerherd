import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import getPublicPostSchema from "../schemas/get-public-post-schema";

const publicPostQuery = resolver.pipe(
  resolver.zod(getPublicPostSchema),

  async ({ slug }) => {
    const post = await db.post.findUnique({
      where: { slug },
    });

    if (!post) {
      throw new NotFoundError();
    }

    return post;
  }
);

export type PublicPostResult = PromiseReturnType<typeof publicPostQuery>;

export default publicPostQuery;
