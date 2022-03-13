import type { Gear } from "db";

import { resolver } from "blitz";

import db from "db";

import searchGearSchema from "../schemas/search-gear-schema";

const searchGearQuery = resolver.pipe(
  resolver.zod(searchGearSchema),

  async ({ query }) => {
    if (!query) return [];

    const results = await db.$queryRaw`
      SELECT
        gear.*,
        gear.id,
        Count(clone."clonedFromId") as "cloneCount"
      FROM
        "Gear" gear
      LEFT JOIN
        "Gear" clone
      ON
        gear.id = clone."clonedFromId"
      WHERE
        gear."clonedFromId" IS NULL
      AND
        (SIMILARITY(gear.name, ${query}) > 0.15 OR COALESCE(SIMILARITY(gear.notes, ${query}), 0) > 0.1)
      GROUP BY
        gear.id
      ORDER BY
        (SIMILARITY(gear.name, ${query}) + (COALESCE(SIMILARITY(gear.notes, ${query}), 0) * 0.3)) * (1 + LEAST(0.1, (Count(clone."clonedFromId") / 100))) DESC
      LIMIT
        20;
    `;

    return results as Gear[];
  }
);

export default searchGearQuery;
