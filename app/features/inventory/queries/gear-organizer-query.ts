import type { PromiseReturnType } from "blitz";

import { resolver } from "blitz";

import db from "db";

import getGearOrganizerSchema from "../schemas/get-gear-organizer-schema";

const gearOrganizerQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(getGearOrganizerSchema),

  async ({ type }, ctx) => {
    return db.category.findMany({
      where: { userId: ctx.session.userId, type },
      orderBy: { index: "asc" },
      include: {
        items: {
          orderBy: { index: "asc" },
          include: {
            gear: true,
          },
        },
      },
    });
  }
);

export type GearOrganizerResult = PromiseReturnType<typeof gearOrganizerQuery>;
export type GearOrganizerResultCategory = GearOrganizerResult[number];
export type GearOrganizerResultCategoryItem =
  GearOrganizerResult[number]["items"][number];
export type GearOrganizerResultGear =
  GearOrganizerResult[number]["items"][number]["gear"];

export default gearOrganizerQuery;
