import type { User } from "db";

import { AuthenticationError } from "blitz";

import papaparse from "papaparse";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";
import createCategory from "test/helpers/create-category";
import createGear from "test/helpers/create-gear";
import createCategoryItem from "test/helpers/create-category-item";
import displayCurrency from "app/modules/common/helpers/display-currency";
import csvHeadingRow from "test/data/csv-heading-row";

import inventoryExportCsvMutation from "./inventory-export-csv-mutation";

let user: User;

beforeEach(async () => {
  user = await createUser();
});

describe("inventoryExportCsvMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      inventoryExportCsvMutation({ type: "INVENTORY" }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should return the correct CSV", async () => {
    const { ctx } = await createMockContext({ user });

    const category0 = await createCategory({ userId: user.id });
    const category1 = await createCategory({ userId: user.id });
    const category2 = await createCategory({ userId: user.id });

    const gear0 = await createGear({ userId: user.id });
    const gear1 = await createGear({ userId: user.id });
    const gear2 = await createGear({ userId: user.id });

    const items = [
      {
        index: 0,
        gear: gear0,
        category: category0,
      },
      {
        index: 1,
        gear: gear1,
        category: category0,
      },
      {
        index: 0,
        gear: gear0,
        category: category1,
      },
      {
        index: 1,
        gear: gear2,
        category: category1,
      },
      {
        index: 0,
        gear: gear0,
        category: category2,
      },
      {
        index: 1,
        gear: gear1,
        category: category2,
      },
      {
        index: 2,
        gear: gear2,
        category: category2,
      },
    ];

    await Promise.all(
      items.map((item) =>
        createCategoryItem({
          index: item.index,
          gearId: item.gear.id,
          categoryId: item.category.id,
        })
      )
    );

    const result = await inventoryExportCsvMutation({ type: "INVENTORY" }, ctx);

    const parsedData = papaparse.parse(result);

    parsedData.data.forEach((row, i) => {
      if (i === 0) {
        expect(row).toEqual(csvHeadingRow);
      } else {
        const item = items[i - 1];

        if (!item) throw new Error("Item not found");

        expect(row).toEqual([
          item.gear.name,
          item.category.name,
          `${item.gear.weight}`,
          "gram",
          item.gear.notes || "",
          item.gear.price ? `${item.gear.price / 100}` : "",
          displayCurrency(item.gear.currency),
          item.gear.link || "",
          item.gear.imageUrl || "",
          item.gear.consumable ? "consumable" : "",
          "",
          "1",
        ]);
      }
    });
  });
});
