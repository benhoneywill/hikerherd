import type { PromiseReturnType } from "blitz";

import { resolver } from "blitz";

import db from "db";

const gearQuery = resolver.pipe(
  resolver.authorize(),

  async (values, ctx) => {
    const categories = await db.gearCategory.findMany({
      where: { ownerId: ctx.session.userId },
      select: {
        id: true,
        name: true,
        gear: {
          orderBy: { index: "asc" },
          include: {
            gear: true,
          },
        },
      },
    });

    const ungroupedGear = await db.gearCategoryGear.findMany({
      where: { gear: { ownerId: ctx.session.userId }, categoryId: null },
      orderBy: { index: "asc" },
      include: {
        gear: true,
      },
    });

    categories.unshift({
      id: "ungrouped",
      name: "ungrouped",
      gear: ungroupedGear,
    });

    return categories;
  }
);

export type GearResult = PromiseReturnType<typeof gearQuery>;

export default gearQuery;
