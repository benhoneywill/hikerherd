import type { PromiseReturnType } from "blitz";

import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import publishBlogPostSchema from "../schemas/publish-blog-post-schema";

const publishBlogPostMutation = resolver.pipe(
  resolver.zod(publishBlogPostSchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    const blogPost = await db.blogPost.findUnique({
      where: { id },
      include: { blog: { select: { users: true } } },
    });

    if (!blogPost) {
      throw new NotFoundError();
    }

    const blogUser = blogPost.blog.users.find(
      (user) => user.userId === ctx.session.userId
    );

    if (!blogUser || blogUser.role !== "ADMIN") {
      throw new AuthorizationError();
    }

    return { id };
  },

  async ({ id }) => {
    return db.blogPost.update({
      where: { id },
      data: {
        publishedAt: new Date(),
      },
    });
  }
);

export type PublishBlogPostResult = PromiseReturnType<
  typeof publishBlogPostMutation
>;

export default publishBlogPostMutation;
