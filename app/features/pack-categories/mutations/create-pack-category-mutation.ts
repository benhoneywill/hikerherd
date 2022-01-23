import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import createPackCategorySchema from "../schemas/create-pack-category-schema";

const createPackCategoryMutation = resolver.pipe(
  resolver.zod(createPackCategorySchema),
  resolver.authorize(),

  async ({ name, packId }, ctx) => {
    const pack = await db.pack.findFirst({
      where: { id: packId, userId: ctx.session.userId },
    });

    if (!pack) {
      throw new NotFoundError();
    }

    return db.$transaction(async () => {
      const lastCategory = await db.packCategory.findFirst({
        where: { packId: pack.id },
        orderBy: { index: "desc" },
      });

      const index = lastCategory ? lastCategory.index + 1 : 0;

      return await db.packCategory.create({
        data: {
          name,
          index,
          packId,
        },
      });
    });
  }
);

export type CreatePackCategoryResult = PromiseReturnType<
  typeof createPackCategoryMutation
>;

export default createPackCategoryMutation;
