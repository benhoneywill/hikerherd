import { NotFoundError, resolver } from "blitz";

import idSchema from "app/modules/common/schemas/id-schema";

import db from "db";

const packOrganizerQuery = resolver.pipe(
  resolver.zod(idSchema),

  async ({ id }) => {
    const pack = await db.pack.findFirst({
      where: { id },
      include: {
        categories: {
          orderBy: { index: "asc" },
          include: {
            items: {
              orderBy: { index: "asc" },
              include: {
                gear: true,
              },
            },
          },
        },
      },
    });

    if (!pack) {
      throw new NotFoundError();
    }

    return pack;
  }
);

export default packOrganizerQuery;
