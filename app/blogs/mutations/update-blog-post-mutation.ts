import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import updateBlogPostSchema from "../schemas/update-blog-post-schema";

const updateBlogPostMutation = resolver.pipe(
  resolver.zod(updateBlogPostSchema),
  resolver.authorize(),

  async ({ id, title, content }) => {
    const Blogpost = await db.blogPost.findUnique({ where: { id } });

    if (!Blogpost) {
      throw new NotFoundError();
    }

    return db.blogPost.update({
      where: { id },
      data: {
        title,
        content: JSON.stringify(content),
      },
    });
  }
);

export type UpdateBlogPostResult = PromiseReturnType<
  typeof updateBlogPostMutation
>;

export default updateBlogPostMutation;
