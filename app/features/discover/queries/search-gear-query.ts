import type { PromiseReturnType } from "blitz";
import type { Gear } from "db";

import { resolver } from "blitz";

import db from "db";

import searchGearSchema from "../schemas/search-gear-schema";

const searchGearQuery = resolver.pipe(
  resolver.zod(searchGearSchema),

  async ({ query }) => {
    if (!query) return [];

    const results = await db.$queryRaw`
      SELECT  *
      FROM "Gear"
      WHERE SIMILARITY(name, ${query}) > 0.2
      OR SIMILARITY(notes, ${query}) > 0.1
      ORDER BY SIMILARITY(name, ${query}) DESC
      LIMIT 20;
    `;

    return results as Gear[];
  }
);

export type SearchGearResult = PromiseReturnType<typeof searchGearQuery>;

export default searchGearQuery;
