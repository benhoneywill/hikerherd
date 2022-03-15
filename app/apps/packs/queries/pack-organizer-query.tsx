import { NotFoundError, resolver } from "blitz";

import idSchema from "app/schemas/id-schema";

import db from "db";

const packOrganizerQuery = resolver.pipe(
  resolver.zod(idSchema),

  async ({ id }, ctx) => {
    const pack = await db.pack.findUnique({
      where: { id },
      select: {
        id: true,
        notes: true,
        name: true,
        userId: true,
        private: true,
        user: {
          select: {
            id: true,
            username: true,
            avatar_id: true,
            avatar_version: true,
          },
        },
        categories: {
          orderBy: { index: "asc" },
          select: {
            id: true,
            name: true,
            items: {
              orderBy: { index: "asc" },
              select: {
                id: true,
                worn: true,
                quantity: true,
                gear: {
                  select: {
                    name: true,
                    weight: true,
                    price: true,
                    currency: true,
                    consumable: true,
                    link: true,
                    notes: true,
                    imageUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!pack || (pack.private && pack.userId !== ctx.session.userId)) {
      throw new NotFoundError();
    }

    return pack;
  }
);

export default packOrganizerQuery;
