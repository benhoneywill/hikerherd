import type { User, PackCategory, PackCategoryItem, Pack } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";
import createPack from "test/helpers/create-pack";
import createPackCategory from "test/helpers/create-pack-category";
import createGear from "test/helpers/create-gear";
import createPackCategoryItem from "test/helpers/create-pack-category-item";

import db from "db";

import updatePackGearQuantityMutation from "./update-pack-gear-quantity-mutation";

let user: User;
let pack: Pack;
let category: PackCategory;
let item: PackCategoryItem;

beforeEach(async () => {
  user = await createUser();
  pack = await createPack({ userId: user.id });
  category = await createPackCategory({ packId: pack.id });

  const gear = await createGear({ userId: user.id });
  item = await createPackCategoryItem({
    categoryId: category.id,
    gearId: gear.id,
    quantity: 1,
  });
});

describe("updatePackGearQuantityMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      updatePackGearQuantityMutation({ id: item.id, type: "increment" }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the item does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      updatePackGearQuantityMutation(
        { id: faker.datatype.uuid(), type: "increment" },
        ctx
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the item does not belong to the user", async () => {
    const otherUser = await createUser();

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      updatePackGearQuantityMutation({ id: item.id, type: "increment" }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should update the item quantity", async () => {
    const { ctx } = await createMockContext({ user });

    await updatePackGearQuantityMutation(
      { id: item.id, type: "increment" },
      ctx
    );

    const fetch1 = await db.packCategoryItem.findUnique({
      where: { id: item.id },
    });

    expect(fetch1?.quantity).toEqual(2);

    await updatePackGearQuantityMutation(
      { id: item.id, type: "decrement" },
      ctx
    );

    const fetch2 = await db.packCategoryItem.findUnique({
      where: { id: item.id },
    });

    expect(fetch2?.quantity).toEqual(1);
  });

  it("should error if you decrement below 0", async () => {
    const { ctx } = await createMockContext({ user });

    // decrement to 0
    await updatePackGearQuantityMutation(
      { id: item.id, type: "decrement" },
      ctx
    );

    // try to go below 0
    await expect(
      updatePackGearQuantityMutation({ id: item.id, type: "decrement" }, ctx)
    ).rejects.toThrow();
  });
});
