import { resolver } from "blitz";

import calculatePackTotals from "app/apps/packs/helpers/calculate-pack-totals";

import db from "db";

import searchPacksSchema from "../schemas/search-packs-schema";

const searchPacksQuery = resolver.pipe(
  resolver.zod(searchPacksSchema),

  async ({ query }) => {
    if (!query) return [];

    const search = query.split(" ").join(" | ");

    const packs = await db.pack.findMany({
      take: 24,

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

      where: {
        private: false,
        NOT: {
          categories: {
            none: {
              NOT: {
                items: {
                  none: {},
                },
              },
            },
          },
        },
        OR: [
          { name: { search, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
          { notes: { search, mode: "insensitive" } },
          { notes: { contains: query, mode: "insensitive" } },
        ],
      },

      orderBy: [
        {
          _relevance: {
            fields: ["name", "notes"],
            search,
            sort: "desc",
          },
        },
      ],
    });

    return packs.map((pack) => {
      const {
        baseWeight,
        totalWeight,
        packWeight,
        wornWeight,
        consumableWeight,
      } = calculatePackTotals(pack.categories);

      return {
        ...pack,
        totals: {
          baseWeight,
          totalWeight,
          packWeight,
          wornWeight,
          consumableWeight,
        },
      };
    });
  }
);

export default searchPacksQuery;
