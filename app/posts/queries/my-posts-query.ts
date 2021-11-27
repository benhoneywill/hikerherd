import { paginate, resolver } from "blitz";

import paginationSchema from "app/core/schemas/pagination-schema";

import db from "db";

const myPostsQuery = resolver.pipe(
  resolver.zod(paginationSchema),
  resolver.authorize(),

  async ({ skip, take }, ctx) => {
    const where = { authorId: ctx.session.userId };

    const result = await paginate({
      skip,
      take,
      count: () => db.post.count({ where }),
      query: (paginateArgs) => {
        return db.post.findMany({
          ...paginateArgs,
          where,
          orderBy: { createdAt: "desc" },
        });
      },
    });

    return result;
  }
);

export default myPostsQuery;
