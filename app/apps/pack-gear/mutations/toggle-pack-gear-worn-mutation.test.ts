import type { User, PackCategory, PackCategoryItem, Pack } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createPack from "test/factories/create-pack";
import createPackCategory from "test/factories/create-pack-category";
import createGear from "test/factories/create-gear";
import createPackCategoryItem from "test/factories/create-pack-category-item";

import db from "db";

import togglePackGearWornMutation from "./toggle-pack-gear-worn-mutation";

let user: User;
let pack: Pack;
let category: PackCategory;
let item: PackCategoryItem;

beforeEach(async () => {
  user = await createUser({});
  pack = await createPack({ userId: user.id });
  category = await createPackCategory({ packId: pack.id });

  const gear = await createGear({ userId: user.id });
  item = await createPackCategoryItem({
    categoryId: category.id,
    gearId: gear.id,
    worn: false,
  });
});

describe("togglePackGearWornMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      togglePackGearWornMutation({ id: item.id }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the item does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      togglePackGearWornMutation({ id: faker.datatype.uuid() }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the item does not belong to the user", async () => {
    const otherUser = await createUser({});

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      togglePackGearWornMutation({ id: item.id }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should toggle worn on the item", async () => {
    const { ctx } = await createMockContext({ user });

    await togglePackGearWornMutation({ id: item.id }, ctx);

    const fetchedItem = await db.packCategoryItem.findUnique({
      where: { id: item.id },
    });

    expect(fetchedItem?.worn).toEqual(true);
  });
});
