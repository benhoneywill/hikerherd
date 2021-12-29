import type { PromiseReturnType } from "blitz";

import { paginate, resolver } from "blitz";

import paginationSchema from "app/common/schemas/pagination-schema";

import db from "db";

const gearListsQuery = resolver.pipe(
  resolver.zod(paginationSchema),
  resolver.authorize(),

  async ({ skip, take }, ctx) => {
    const where = { ownerId: ctx.session.userId };

    const result = await paginate({
      skip,
      take,
      count: () => db.gearList.count({ where }),
      query: async (paginateArgs) => {
        return db.gearList.findMany({
          ...paginateArgs,
          where,
          orderBy: { createdAt: "desc" },
        });
      },
    });

    return result;
  }
);

export type GearListsResult = PromiseReturnType<typeof gearListsQuery>;
export type GearListsResultItem = GearListsResult["items"][number];

export default gearListsQuery;
