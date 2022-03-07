import type { CsvItem } from "app/modules/common/helpers/item-to-csv-format";

import { AuthenticationError, resolver } from "blitz";

import papaparse from "papaparse";

import itemToCsvFormat from "app/modules/common/helpers/item-to-csv-format";

import db from "db";

import getInventorySchema from "../schemas/get-inventory-schema";

const inventoryExportCsvMutation = resolver.pipe(
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
              orderBy: { index: "asc" },
              include: {
                gear: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new AuthenticationError();
    }

    const items: CsvItem[] = user.categories
      .map(({ name: category, items }) =>
        items.map((item) =>
          itemToCsvFormat({ category, item, weightUnit: user?.weightUnit })
        )
      )
      .flat();

    return papaparse.unparse(items);
  }
);

export default inventoryExportCsvMutation;
