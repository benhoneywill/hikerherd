import type { PromiseReturnType } from "blitz";

import { resolver } from "blitz";

import db from "db";

const gearQuery = resolver.pipe(
  resolver.authorize(),

  async (values, ctx) => {
    const categories = await db.gearCategory.findMany({
      where: { ownerId: ctx.session.userId },
      orderBy: { index: "asc" },
      select: {
        id: true,
        name: true,
        index: true,
        gear: {
          orderBy: { index: "asc" },
          include: {
            gear: true,
          },
        },
      },
    });

    return categories;
  }
);

export type GearResult = PromiseReturnType<typeof gearQuery>;

export default gearQuery;
