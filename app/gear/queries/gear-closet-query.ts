import type { PromiseReturnType } from "blitz";

import { resolver } from "blitz";

import db from "db";

const gearClosetQuery = resolver.pipe(
  resolver.authorize(),

  async (values, ctx) => {
    return db.gearCategory.findMany({
      where: { ownerId: ctx.session.userId },
      orderBy: { index: "asc" },
      select: {
        id: true,
        name: true,
        index: true,
        gear: {
          orderBy: { index: "asc" },
        },
      },
    });
  }
);

export type GearClosetResult = PromiseReturnType<typeof gearClosetQuery>;

export default gearClosetQuery;
