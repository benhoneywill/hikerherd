import type { User, Category, CategoryItem } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createCategory from "test/factories/create-category";
import createGear from "test/factories/create-gear";
import createCategoryItem from "test/factories/create-category-item";

import db from "db";

import moveCategoryGearMutation from "./move-category-gear-mutation";

let user: User;
let category1: Category;
let category2: Category;
let item1: CategoryItem;

beforeEach(async () => {
  user = await createUser({});

  category1 = await createCategory({ userId: user.id, index: 0 });
  category2 = await createCategory({ userId: user.id, index: 1 });

  const gear = await createGear({ userId: user.id });
  item1 = await createCategoryItem({
    categoryId: category1.id,
    gearId: gear.id,
  });
});

describe("moveCategoryGearMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      moveCategoryGearMutation(
        { id: item1.id, categoryId: category2.id, index: 0 },
        ctx
      )
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the item does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      moveCategoryGearMutation(
        { id: faker.datatype.uuid(), categoryId: category2.id, index: 0 },
        ctx
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the item does not belong to the user", async () => {
    const otherUser = await createUser({});

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      moveCategoryGearMutation(
        { id: item1.id, categoryId: category2.id, index: 0 },
        ctx
      )
    ).rejects.toThrow(AuthorizationError);
  });

  it("should error if the destination category does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      moveCategoryGearMutation(
        { id: item1.id, categoryId: faker.datatype.uuid(), index: 0 },
        ctx
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the destination category does not belong to the user", async () => {
    const otherUser = await createUser({});

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      moveCategoryGearMutation(
        { id: item1.id, categoryId: category2.id, index: 0 },
        ctx
      )
    ).rejects.toThrow(AuthorizationError);
  });

  it("should update the category and indexes of items correctly", async () => {
    const { ctx } = await createMockContext({ user });

    const gear = await createGear({ userId: user.id });

    const item2 = await createCategoryItem({
      index: 0,
      categoryId: category2.id,
      gearId: gear.id,
    });

    const item3 = await createCategoryItem({
      index: 1,
      categoryId: category1.id,
      gearId: gear.id,
    });

    await moveCategoryGearMutation(
      { id: item1.id, categoryId: category2.id, index: 0 },
      ctx
    );

    const fetchedItem1 = await db.categoryItem.findUnique({
      where: { id: item1.id },
    });
    const fetchedItem2 = await db.categoryItem.findUnique({
      where: { id: item2.id },
    });
    const fetchedItem3 = await db.categoryItem.findUnique({
      where: { id: item3.id },
    });

    expect(fetchedItem1?.categoryId).toEqual(category2.id);
    expect(fetchedItem1?.index).toEqual(0);
    expect(fetchedItem2?.index).toEqual(1);
    expect(fetchedItem3?.index).toEqual(0);
  });
});
