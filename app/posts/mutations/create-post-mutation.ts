import type { PromiseReturnType } from "blitz";

import { resolver } from "blitz";

import slugify from "app/core/helpers/slugify";

import db from "db";

import createPostSchema from "../schemas/create-post-schema";

const createPostMutation = resolver.pipe(
  resolver.zod(createPostSchema),
  resolver.authorize(),

  async ({ title, content }, ctx) => {
    return db.post.create({
      data: {
        title,
        content: JSON.stringify(content),
        authorId: ctx.session.userId,
        slug: slugify(title, { withRandomSuffix: true }),
      },
    });
  }
);

export type CreatePostResult = PromiseReturnType<typeof createPostMutation>;

export default createPostMutation;
