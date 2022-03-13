import { resolver } from "blitz";

import db from "db";

import calculatePackTotals from "../helpers/calculate-pack-totals";

const packsQuery = resolver.pipe(
  resolver.authorize(),

  async (values, ctx) => {
    const packs = await db.pack.findMany({
      where: { userId: ctx.session.userId },
      include: {
        categories: {
          include: {
            items: {
              include: {
                gear: true,
              },
            },
          },
        },
      },
    });

    return packs.map((pack) => {
      const { baseWeight, totalWeight, packWeight } = calculatePackTotals(
        pack.categories
      );

      return {
        name: pack.name,
        private: pack.private,
        id: pack.id,
        totals: { baseWeight, totalWeight, packWeight },
      };
    });
  }
);

export default packsQuery;
