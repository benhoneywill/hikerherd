import type { CsvItem } from "app/helpers/item-to-csv-format";

import { AuthorizationError, NotFoundError, resolver } from "blitz";

import papaparse from "papaparse";

import itemToCsvFormat from "app/helpers/item-to-csv-format";
import idSchema from "app/schemas/id-schema";

import db from "db";

const packExportCsvMutation = resolver.pipe(
  resolver.authorize(),
  resolver.zod(idSchema),

  async ({ id }, ctx) => {
    const pack = await db.pack.findUnique({
      where: { id },
      select: {
        user: { select: { id: true, weightUnit: true } },
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

    if (pack.user.id !== ctx.session.userId) {
      throw new AuthorizationError();
    }

    const categories = pack?.categories || [];

    const items: CsvItem[] = categories
      .map(({ name: category, items }) =>
        items.map((item) =>
          itemToCsvFormat({
            category,
            item,
            weightUnit: pack?.user?.weightUnit,
          })
        )
      )
      .flat();

    return papaparse.unparse(items);
  }
);

export default packExportCsvMutation;
