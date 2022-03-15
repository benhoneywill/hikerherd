import type { User, Pack, PackCategory, PackCategoryItem } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createPack from "test/factories/create-pack";
import createPackCategory from "test/factories/create-pack-category";
import createGear from "test/factories/create-gear";
import createPackCategoryItem from "test/factories/create-pack-category-item";

import db from "db";

import movePackGearMutation from "./move-pack-gear-mutation";

let user: User;
let pack: Pack;
let category1: PackCategory;
let category2: PackCategory;
let item: PackCategoryItem;

beforeEach(async () => {
  user = await createUser({});
  pack = await createPack({ userId: user.id });

  category1 = await createPackCategory({ packId: pack.id, index: 0 });
  category2 = await createPackCategory({ packId: pack.id, index: 1 });

  const gear = await createGear({ userId: user.id });

  item = await createPackCategoryItem({
    categoryId: category1.id,
    gearId: gear.id,
  });
});

describe("movePackGearMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      movePackGearMutation(
        { id: item.id, categoryId: category2.id, index: 0 },
        ctx
      )
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the item does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      movePackGearMutation(
        { id: faker.datatype.uuid(), categoryId: category2.id, index: 0 },
        ctx
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the item does not belong to the user", async () => {
    const otherUser = await createUser({});

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      movePackGearMutation(
        { id: item.id, categoryId: category2.id, index: 0 },
        ctx
      )
    ).rejects.toThrow(AuthorizationError);
  });

  it("should error if the destination category does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      movePackGearMutation(
        { id: item.id, categoryId: faker.datatype.uuid(), index: 0 },
        ctx
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the destination category does not belong to the user", async () => {
    const otherUser = await createUser({});
    const otherCategory = await createPackCategory({
      packId: pack.id,
      index: 1,
    });

    const gear = await createGear({ userId: user.id });

    const otherItem = await createPackCategoryItem({
      categoryId: otherCategory.id,
      gearId: gear.id,
    });

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      movePackGearMutation(
        { id: otherItem.id, categoryId: category2.id, index: 0 },
        ctx
      )
    ).rejects.toThrow(AuthorizationError);
  });

  it("should update the category and indexes of items correctly", async () => {
    const { ctx } = await createMockContext({ user });

    const gear = await createGear({ userId: user.id });

    const item2 = await createPackCategoryItem({
      categoryId: category2.id,
      gearId: gear.id,
      index: 0,
    });

    const item3 = await createPackCategoryItem({
      categoryId: category1.id,
      gearId: gear.id,
      index: 1,
    });

    await movePackGearMutation(
      { id: item.id, categoryId: category2.id, index: 0 },
      ctx
    );

    const fetchedItem = await db.packCategoryItem.findUnique({
      where: { id: item.id },
    });
    const fetchedItem2 = await db.packCategoryItem.findUnique({
      where: { id: item2.id },
    });
    const fetchedItem3 = await db.packCategoryItem.findUnique({
      where: { id: item3.id },
    });

    expect(fetchedItem?.categoryId).toEqual(category2.id);
    expect(fetchedItem?.index).toEqual(0);
    expect(fetchedItem2?.index).toEqual(1);
    expect(fetchedItem3?.index).toEqual(0);
  });
});
