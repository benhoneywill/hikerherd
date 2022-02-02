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
        SIMILARITY(gear.name, ${query}) > 0.2
      GROUP BY
        gear.id
      ORDER BY
        SIMILARITY(gear.name, ${query}) DESC,
        "cloneCount" DESC
      LIMIT
        20;
    `;

    return results as Gear[];
  }
);

export default searchGearQuery;
