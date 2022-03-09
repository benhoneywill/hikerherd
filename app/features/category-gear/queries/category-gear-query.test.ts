import type { User, Category, CategoryItem } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";
import createCategory from "test/helpers/create-category";
import createGear from "test/helpers/create-gear";
import createCategoryItem from "test/helpers/create-category-item";

import categoryGearQuery from "./category-gear-query";

let user: User;
let category: Category;
let item: CategoryItem;

beforeEach(async () => {
  user = await createUser();
  category = await createCategory({ userId: user.id });

  const gear = await createGear({ userId: user.id });
  item = await createCategoryItem({
    categoryId: category.id,
    gearId: gear.id,
  });
});

describe("categoryGearQuery", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(categoryGearQuery({ id: item.id }, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  it("should error if the item does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      categoryGearQuery({ id: faker.datatype.uuid() }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the item does not belong to the user", async () => {
    const otherUser = await createUser();

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(categoryGearQuery({ id: item.id }, ctx)).rejects.toThrow(
      AuthorizationError
    );
  });

  it("Should return the item", async () => {
    const { ctx } = await createMockContext({ user });

    const result = await categoryGearQuery({ id: item.id }, ctx);

    expect(result).toMatchObject({
      id: item.id,
      gear: {
        id: item.gearId,
      },
    });
  });
});
