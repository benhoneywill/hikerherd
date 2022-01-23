import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import getPackSchema from "../schemas/get-pack-schema";

const packQuery = resolver.pipe(
  resolver.zod(getPackSchema),

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

export type PackResult = PromiseReturnType<typeof packQuery>;

export default packQuery;
