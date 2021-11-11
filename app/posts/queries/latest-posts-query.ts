import type { Prisma } from "db";
import type { Ctx } from "blitz";

import { paginate } from "blitz";

import db from "db";

type LatestPostsOptions = {
  skip?: Prisma.PostFindManyArgs["skip"];
  take?: Prisma.PostFindManyArgs["take"];
};

const latestPostsQuery = async ({ skip = 0, take = 15 }: LatestPostsOptions, { session }: Ctx) => {
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
};

export default latestPostsQuery;
