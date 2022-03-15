import type { User, Category, CategoryItem } from "db";

import { AuthenticationError } from "blitz";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createCategory from "test/factories/create-category";
import createGear from "test/factories/create-gear";
import createCategoryItem from "test/factories/create-category-item";

import inventoryQuery from "./inventory-query";

let user: User;
let category: Category;
let item: CategoryItem;

beforeEach(async () => {
  user = await createUser({});
  category = await createCategory({ userId: user.id });
  const gear = await createGear({ userId: user.id });
  item = await createCategoryItem({ categoryId: category.id, gearId: gear.id });
});

describe("inventoryQuery", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(inventoryQuery({ type: "INVENTORY" }, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  it("Should return the inventory", async () => {
    const { ctx } = await createMockContext({ user });

    const result = await inventoryQuery({ type: "INVENTORY" }, ctx);

    expect(result[0]?.name).toEqual(category.name);
    expect(result[0]?.items[0]?.id).toEqual(item.id);
  });
});
