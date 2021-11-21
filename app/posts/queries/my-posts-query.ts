import type { Prisma } from "db";
import type { Ctx } from "blitz";

import { AuthenticationError } from "blitz";
import { paginate } from "blitz";

import db from "db";

type MyPostsOptions = {
  skip?: Prisma.PostFindManyArgs["skip"];
  take?: Prisma.PostFindManyArgs["take"];
};

const myPostsQuery = async ({ skip = 0, take = 15 }: MyPostsOptions, { session }: Ctx) => {
  if (!session.userId) {
    throw new AuthenticationError();
  }

  const where = { authorId: session.userId };

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
};

export default myPostsQuery;
