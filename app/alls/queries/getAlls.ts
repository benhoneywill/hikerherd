import type { Prisma } from "db";

import { paginate, resolver } from "blitz";

import db from "db";

interface GetAllsInput
  extends Pick<Prisma.AllFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetAllsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: alls,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.all.count({ where }),
      query: (paginateArgs) =>
        db.all.findMany({ ...paginateArgs, where, orderBy }),
    });

    return {
      alls,
      nextPage,
      hasMore,
      count,
    };
  }
);
