import { resolver } from "blitz";

import { slugify } from "app/core/helpers/slugs";

import db from "db";

import { CreatePostSchema } from "../schemas/create-post-schema";

const changePasswordMutation = resolver.pipe(
  resolver.zod(CreatePostSchema),
  resolver.authorize(),

  async ({ title, content, publish }, ctx) => {
    return db.post.create({
      data: {
        title,
        content: JSON.stringify(content),
        publishedAt: publish ? new Date() : null,
        authorId: ctx.session.userId,
        slug: slugify(title, { withRandomSuffix: true }),
      },
    });
  }
);

export default changePasswordMutation;
