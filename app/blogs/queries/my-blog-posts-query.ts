import type { PromiseReturnType } from "blitz";

import { paginate, NotFoundError, resolver } from "blitz";

import db from "db";

import getMyBlogPostsSchema from "../schemas/get-my-blog-posts-schema";

const myBlogPostsQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(getMyBlogPostsSchema),

  async ({ slug, skip, take }, ctx) => {
    const blogUser = await db.blogUser.findFirst({
      where: {
        userId: ctx.session.userId,
        blog: { slug },
      },
    });

    if (!blogUser) {
      throw new NotFoundError();
    }

    const where = { blogId: blogUser.blogId };

    return paginate({
      skip,
      take,
      count: () => db.blogPost.count({ where }),
      query: async (paginateArgs) => {
        return db.blogPost.findMany({
          ...paginateArgs,
          where,
          orderBy: { createdAt: "desc" },
        });
      },
    });
  }
);

export type MyBlogPostsResult = PromiseReturnType<typeof myBlogPostsQuery>;
export type MyBlogPostsResultItem = MyBlogPostsResult["items"][number];

export default myBlogPostsQuery;
