import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import createPackCategorySchema from "../schemas/create-pack-category-schema";
import getNextPackCategoryIndex from "../functions/get-next-pack-category-index";

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
      const index = await getNextPackCategoryIndex(prisma, ctx, {
        packId: pack.id,
      });

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
