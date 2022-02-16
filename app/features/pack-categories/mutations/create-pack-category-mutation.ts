import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import createPackCategorySchema from "../schemas/create-pack-category-schema";

const createPackCategoryMutation = resolver.pipe(
  resolver.zod(createPackCategorySchema),
  resolver.authorize(),

  async ({ name, packId }, ctx) => {
    const pack = await db.pack.findUnique({
      where: { id: packId },
    });

    if (!pack) {
      throw new NotFoundError();
    }

    if (pack.userId !== ctx.session.userId) {
      throw new AuthorizationError();
    }

    return db.$transaction(async (prisma) => {
      const lastCategory = await prisma.packCategory.findFirst({
        where: { packId },
        orderBy: { index: "desc" },
      });

      const index = lastCategory ? lastCategory.index + 1 : 0;

      return await prisma.packCategory.create({
        data: {
          name,
          index,
          packId,
        },
      });
    });
  }
);

export default createPackCategoryMutation;
