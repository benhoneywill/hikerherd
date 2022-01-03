import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import getPackSchema from "../schemas/get-pack-schema";

const packQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(getPackSchema),

  async ({ id }, ctx) => {
    const pack = await db.pack.findFirst({
      where: { userId: ctx.session.userId, id },
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

export type PackResult = PromiseReturnType<typeof packQuery>;

export default packQuery;
