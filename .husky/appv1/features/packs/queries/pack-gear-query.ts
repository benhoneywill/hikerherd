import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import getPackGearSchema from "../schemas/get-pack-gear-schema";

const packGearQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(getPackGearSchema),

  async ({ id }, ctx) => {
    const packGear = await db.packCategoryItem.findFirst({
      where: { id, category: { pack: { userId: ctx.session.userId } } },
      include: { gear: true },
    });

    if (!packGear) throw new NotFoundError();

    return packGear;
  }
);

export type PackGearResult = PromiseReturnType<typeof packGearQuery>;

export default packGearQuery;
