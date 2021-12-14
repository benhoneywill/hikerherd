import type { PromiseReturnType } from "blitz";

import { paginate, resolver } from "blitz";

import paginationSchema from "app/core/schemas/pagination-schema";

import db from "db";

const latestPostsQuery = resolver.pipe(
  resolver.zod(paginationSchema),

  async ({ skip, take }) => {
    const result = await paginate({
      skip,
      take,
      count: () => db.post.count(),
      query: (paginateArgs) => {
        return db.post.findMany({
          ...paginateArgs,
          orderBy: { createdAt: "desc" },
          include: {
            author: true,
          },
        });
      },
    });

    return result;
  }
);

export type LatestPostsResult = PromiseReturnType<typeof latestPostsQuery>;
export type LatestPostsResultItem = LatestPostsResult["items"][number];

export default latestPostsQuery;
