import { resolver } from "blitz";

import db from "db";

import searchGearSchema from "../schemas/search-gear-schema";

const searchGearQuery = resolver.pipe(
  resolver.zod(searchGearSchema),

  async ({ query, minWeight, maxWeight }) => {
    if (!query) return [];

    const search = query.split(" ").join(" | ");

    return db.gear.findMany({
      take: 24,

      where: {
        OR: [
          { name: { search, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
          { notes: { search, mode: "insensitive" } },
          { notes: { contains: query, mode: "insensitive" } },
        ],
        clonedFromId: null,
        weight: { gte: minWeight, lte: maxWeight },
      },

      include: {
        _count: {
          select: { clones: true },
        },
      },

      orderBy: [
        {
          _relevance: {
            fields: ["name", "notes"],
            search,
            sort: "desc",
          },
        },
        {
          clones: {
            _count: "desc",
          },
        },
      ],
    });
  }
);

export default searchGearQuery;
