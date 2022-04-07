import type { User, Category, CategoryItem } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createCategory from "test/factories/create-category";
import createGear from "test/factories/create-gear";
import createCategoryItem from "test/factories/create-category-item";

import db from "db";

import updateCategoryGearQuantityMutation from "./update-category-gear-quantity-mutation";

let user: User;
let category: Category;
let item: CategoryItem;

beforeEach(async () => {
  user = await createUser({});
  category = await createCategory({ userId: user.id });

  const gear = await createGear({ userId: user.id });
  item = await createCategoryItem({
    categoryId: category.id,
    gearId: gear.id,
    quantity: 1,
  });
});

describe("updateCategoryGearQuantityMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      updateCategoryGearQuantityMutation(
        { id: item.id, type: "increment" },
        ctx
      )
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the item does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      updateCategoryGearQuantityMutation(
        { id: faker.datatype.uuid(), type: "increment" },
        ctx
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the item does not belong to the user", async () => {
    const otherUser = await createUser({});

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      updateCategoryGearQuantityMutation(
        { id: item.id, type: "increment" },
        ctx
      )
    ).rejects.toThrow(AuthorizationError);
  });

  it("should update the item quantity", async () => {
    const { ctx } = await createMockContext({ user });

    await updateCategoryGearQuantityMutation(
      { id: item.id, type: "increment" },
      ctx
    );

    const fetch1 = await db.categoryItem.findUnique({
      where: { id: item.id },
    });

    expect(fetch1?.quantity).toEqual(2);

    await updateCategoryGearQuantityMutation(
      { id: item.id, type: "decrement" },
      ctx
    );

    const fetch2 = await db.categoryItem.findUnique({
      where: { id: item.id },
    });

    expect(fetch2?.quantity).toEqual(1);
  });

  it("should error if you decrement below 0", async () => {
    const { ctx } = await createMockContext({ user });

    // decrement to 0
    await updateCategoryGearQuantityMutation(
      { id: item.id, type: "decrement" },
      ctx
    );

    // try to go below 0
    await expect(
      updateCategoryGearQuantityMutation(
        { id: item.id, type: "decrement" },
        ctx
      )
    ).rejects.toThrow();
  });
});
