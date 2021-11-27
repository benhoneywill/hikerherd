import { NotFoundError, resolver } from "blitz";

import db from "db";

import getPublicPostSchema from "../schemas/get-public-post-schema";

const publicPostQuery = resolver.pipe(
  resolver.zod(getPublicPostSchema),

  async ({ slug }) => {
    const post = await db.post.findFirst({
      where: { slug },
    });

    if (!post || !post.publishedAt) {
      throw new NotFoundError();
    }

    return post;
  }
);

export default publicPostQuery;
