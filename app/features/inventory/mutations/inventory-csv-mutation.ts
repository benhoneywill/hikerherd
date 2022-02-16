import type { CsvItem } from "app/modules/common/helpers/item-to-csv-format";

import { resolver } from "blitz";

import papaparse from "papaparse";

import itemToCsvFormat from "app/modules/common/helpers/item-to-csv-format";

import db from "db";

import getInventorySchema from "../schemas/get-inventory-schema";

const importInventoryMutation = resolver.pipe(
  resolver.authorize(),
  resolver.zod(getInventorySchema),

  async ({ type }, ctx) => {
    const user = await db.user.findUnique({
      where: { id: ctx.session.userId },
      select: {
        weightUnit: true,
        categories: {
          where: { type },
          orderBy: { index: "asc" },
          include: {
            items: {
              include: {
                gear: true,
              },
            },
          },
        },
      },
    });

    const categories = user?.categories || [];

    const items: CsvItem[] = categories
      .map(({ name: category, items }) =>
        items.map((item) =>
          itemToCsvFormat({ category, item, weightUnit: user?.weightUnit })
        )
      )
      .flat();

    return papaparse.unparse(items);
  }
);

export default importInventoryMutation;