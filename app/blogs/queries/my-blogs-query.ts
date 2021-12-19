import type { PromiseReturnType } from "blitz";

import { paginate, resolver } from "blitz";

import paginationSchema from "app/common/schemas/pagination-schema";

import db from "db";

const myBlogsQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(paginationSchema),

  async ({ skip, take }, ctx) => {
    const where = { userId: ctx.session.userId };

    return paginate({
      skip,
      take,
      count: () => db.blogUser.count({ where }),
      query: async (paginateArgs) => {
        const result = await db.blogUser.findMany({
          ...paginateArgs,
          where,
          orderBy: { blog: { name: "asc" } },
          include: {
            blog: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        });

        return result.map((blogUser) => ({
          role: blogUser.role,
          name: blogUser.blog.name,
          slug: blogUser.blog.slug,
        }));
      },
    });
  }
);

export type MyBlogsResult = PromiseReturnType<typeof myBlogsQuery>;
export type MyBlogsResultItem = MyBlogsResult["items"][number];

export default myBlogsQuery;
