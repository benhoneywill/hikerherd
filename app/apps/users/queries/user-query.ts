import { NotFoundError, resolver } from "blitz";

import calculatePackTotals from "app/apps/packs/helpers/calculate-pack-totals";

import db from "db";

import getUserSchema from "../schemas/get-user-schema";

const userQuery = resolver.pipe(
  resolver.zod(getUserSchema),

  async ({ username }) => {
    const user = await db.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        avatar: true,
        packs: {
          where: { private: false },
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
        },
      },
    });

    if (!user) {
      throw new NotFoundError();
    }

    const packs = user.packs.map((pack) => {
      const { baseWeight, totalWeight, packWeight } = calculatePackTotals(
        pack.categories
      );

      return {
        name: pack.name,
        id: pack.id,
        private: pack.private,
        totals: { baseWeight, totalWeight, packWeight },
      };
    });

    return { ...user, packs };
  }
);

export default userQuery;
