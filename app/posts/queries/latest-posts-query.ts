import type { PromiseReturnType } from "blitz";

import { paginate, resolver } from "blitz";

import paginationSchema from "app/core/schemas/pagination-schema";

import db from "db";

const latestPostsQuery = resolver.pipe(
  resolver.zod(paginationSchema),

  async ({ skip, take }) => {
    const where = { publishedAt: { not: null } };

    const result = await paginate({
      skip,
      take,
      count: () => db.post.count({ where }),
      query: (paginateArgs) => {
        return db.post.findMany({
          ...paginateArgs,
          where,
          orderBy: { publishedAt: "desc" },
        });
      },
    });

    return result;
  }
);

export type LatestPostsResult = PromiseReturnType<typeof latestPostsQuery>;

export default latestPostsQuery;
