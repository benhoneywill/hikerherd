import type { User, Pack } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import papaparse from "papaparse";
import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createPack from "test/factories/create-pack";
import createPackCategory from "test/factories/create-pack-category";
import createGear from "test/factories/create-gear";
import createPackCategoryItem from "test/factories/create-pack-category-item";
import displayCurrency from "app/helpers/display-currency";

import packExportCsvMutation from "./pack-export-csv-mutation";

let user: User;
let pack: Pack;

beforeEach(async () => {
  user = await createUser({});
  pack = await createPack({ userId: user.id });
});

describe("packExportCsvMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(packExportCsvMutation({ id: pack.id }, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  it("should error if the pack does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      packExportCsvMutation({ id: faker.datatype.uuid() }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the pack does not belong to the user", async () => {
    const otherUser = await createUser({});

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(packExportCsvMutation({ id: pack.id }, ctx)).rejects.toThrow(
      AuthorizationError
    );
  });

  it("should return the correct CSV", async () => {
    const { ctx } = await createMockContext({ user });

    const category0 = await createPackCategory({ packId: pack.id });
    const category1 = await createPackCategory({ packId: pack.id });
    const category2 = await createPackCategory({ packId: pack.id });

    const gear0 = await createGear({ userId: user.id });
    const gear1 = await createGear({ userId: user.id });
    const gear2 = await createGear({ userId: user.id });

    const items = [
      {
        index: 0,
        gear: gear0,
        category: category0,
        worn: true,
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
        quantity: 5,
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
        createPackCategoryItem({
          index: item.index,
          gearId: item.gear.id,
          categoryId: item.category.id,
          worn: !!item.worn,
          quantity: item.quantity,
        })
      )
    );

    const result = await packExportCsvMutation({ id: pack.id }, ctx);

    const parsedData = papaparse.parse(result, { header: true });

    parsedData.data.forEach((row, i) => {
      const item = items[i];

      if (!item) fail("Item not found");

      expect(row).toMatchObject({
        name: item.gear.name,
        category: item.category.name,
        weight: `${item.gear.weight}`,
        unit: "gram",
        notes: item.gear.notes || "",
        price: item.gear.price ? `${item.gear.price / 100}` : "",
        currency: displayCurrency(item.gear.currency),
        link: item.gear.link || "",
        image: item.gear.imageUrl || "",
        consumable: item.gear.consumable ? "consumable" : "",
        worn: item.worn ? "worn" : "",
        quantity: `${item.quantity || 1}`,
      });
    });
  });
});
