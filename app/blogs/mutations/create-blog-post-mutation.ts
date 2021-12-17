import type { PromiseReturnType } from "blitz";

import { AuthorizationError, NotFoundError, resolver } from "blitz";

import slugify from "app/common/helpers/slugify";

import db from "db";

import createBlogPostSchema from "../schemas/create-blog-post-schema";

const createBlogPostMutation = resolver.pipe(
  resolver.zod(createBlogPostSchema),
  resolver.authorize(),

  async ({ blogId, ...values }, ctx) => {
    const blog = await db.blog.findUnique({
      where: { id: blogId },
      include: { users: true },
    });

    if (!blog) {
      throw new NotFoundError();
    }

    const blogUser = blog.users.find(
      (user) => user.userId === ctx.session.userId
    );

    if (!blogUser) {
      throw new AuthorizationError();
    }

    return { blogId, ...values };
  },

  async ({ blogId, title, content }, ctx) => {
    return db.blogPost.create({
      data: {
        title,
        blogId,
        content: JSON.stringify(content),
        authorId: ctx.session.userId,
        slug: slugify(title, { withRandomSuffix: true }),
      },
    });
  }
);

export type CreateBlogPostResult = PromiseReturnType<
  typeof createBlogPostMutation
>;

export default createBlogPostMutation;
