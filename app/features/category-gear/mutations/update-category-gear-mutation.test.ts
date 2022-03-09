import type { User, Category, CategoryItem } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";
import createCategory from "test/helpers/create-category";
import createGear from "test/helpers/create-gear";
import createCategoryItem from "test/helpers/create-category-item";
import getGearData from "test/data/get-gear-data";

import db from "db";

import updateCategoryGearMutation from "./update-category-gear-mutation";

let user: User;
let category: Category;
let item: CategoryItem;

const gear = getGearData();

beforeEach(async () => {
  user = await createUser();

  category = await createCategory({ userId: user.id });

  const gear = await createGear({ userId: user.id });
  item = await createCategoryItem({
    categoryId: category.id,
    gearId: gear.id,
  });
});

describe("updateCategoryGearMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      updateCategoryGearMutation({ id: item.id, ...gear }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the item does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      updateCategoryGearMutation({ id: "abc123", ...gear }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the item does not belong to the user", async () => {
    const otherUser = await createUser();

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      updateCategoryGearMutation({ id: item.id, ...gear }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should update the item", async () => {
    const { ctx } = await createMockContext({ user });

    const newName = faker.random.word();

    await updateCategoryGearMutation(
      { id: item.id, ...gear, name: newName },
      ctx
    );

    const fetchedItem = await db.categoryItem.findUnique({
      where: { id: item.id },
      include: { gear: true },
    });

    expect(fetchedItem?.gear.name).toEqual(newName);
  });
});
