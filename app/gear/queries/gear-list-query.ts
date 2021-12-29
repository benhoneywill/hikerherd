import type { PromiseReturnType } from "blitz";

import { resolver } from "blitz";

import db from "db";

import getGearListSchema from "../schemas/get-gear-list-schema";

const gearlistQuery = resolver.pipe(
  resolver.zod(getGearListSchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    const categories = await db.gearListCategory.findMany({
      where: { ownerId: ctx.session.userId, listId: id },
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

    return categories.map((category) => ({
      ...category,
      gear: category.gear.map((gear) => gear.gear),
    }));
  }
);

export type GearlistResult = PromiseReturnType<typeof gearlistQuery>;

export default gearlistQuery;
