import type { PromiseReturnType } from "blitz";

import { NotFoundError, AuthorizationError, resolver } from "blitz";

import db from "db";

import getMyBlogPostSchema from "../schemas/get-my-blog-post-schema";

const myBlogPostQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(getMyBlogPostSchema),

  async ({ slug }, ctx) => {
    const blogPost = await db.blogPost.findUnique({
      where: { slug },
      include: {
        blog: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!blogPost) {
      throw new NotFoundError();
    }

    const authorized = !!blogPost.blog.users.find(
      (user) => user.userId === ctx.session.userId
    );

    if (!authorized) {
      throw new AuthorizationError();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { blog, ...post } = blogPost;

    return post;
  }
);

export type MyBlogPostResult = PromiseReturnType<typeof myBlogPostQuery>;

export default myBlogPostQuery;
