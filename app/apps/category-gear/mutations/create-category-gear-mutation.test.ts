import type { User, Category } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";
import getGearData from "test/data/get-gear-data";
import createCategory from "test/helpers/create-category";

import db from "db";

import createCategoryGearMutation from "./create-category-gear-mutation";

let user: User;
let category: Category;

const gear = getGearData();

beforeEach(async () => {
  user = await createUser();
  category = await createCategory({ userId: user.id });
});

describe("createCategoryGearMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      createCategoryGearMutation({ ...gear, categoryId: category.id }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the category is not found", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      createCategoryGearMutation(
        { ...gear, categoryId: faker.datatype.uuid() },
        ctx
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the category does not belong to the user", async () => {
    const otherUser = await createUser();
    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      createCategoryGearMutation({ ...gear, categoryId: category.id }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should correctly create the first gear in a category", async () => {
    const { ctx } = await createMockContext({ user });

    const item = await createCategoryGearMutation(
      { ...gear, categoryId: category.id },
      ctx
    );

    const fetched = await db.categoryItem.findUnique({
      where: { id: item.id },
      include: { gear: true },
    });

    expect(fetched?.index).toEqual(0);
    expect(fetched?.gear).toMatchObject(gear);
  });

  it("should create subsequent items with the correct index", async () => {
    const { ctx } = await createMockContext({ user });

    const first = await createCategoryGearMutation(
      { ...gear, categoryId: category.id },
      ctx
    );

    const second = await createCategoryGearMutation(
      { ...gear, categoryId: category.id },
      ctx
    );

    const third = await createCategoryGearMutation(
      { ...gear, categoryId: category.id },
      ctx
    );

    expect(first.index).toEqual(0);
    expect(second.index).toEqual(1);
    expect(third.index).toEqual(2);
  });

  it("should track different categories with different indexes", async () => {
    const { ctx } = await createMockContext({ user });

    const otherCategory = await createCategory({ userId: user.id, index: 1 });

    const first = await createCategoryGearMutation(
      { ...gear, categoryId: category.id },
      ctx
    );

    const second = await createCategoryGearMutation(
      { ...gear, categoryId: otherCategory.id },
      ctx
    );

    expect(first?.index).toEqual(0);
    expect(second?.index).toEqual(0);
  });
});
