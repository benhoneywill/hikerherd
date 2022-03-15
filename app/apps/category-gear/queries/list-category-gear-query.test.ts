import type { User } from "db";

import { AuthenticationError } from "blitz";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createCategory from "test/factories/create-category";
import createCategoryItem from "test/factories/create-category-item";
import createGear from "test/factories/create-gear";

import listCategoryGearQuery from "./list-category-gear-query";

let user: User;

beforeEach(async () => {
  user = await createUser({});

  const category = await createCategory({ userId: user.id });

  const gear = await createGear({ userId: user.id });

  await createCategoryItem({
    categoryId: category.id,
    gearId: gear.id,
  });

  await createCategoryItem({
    index: 1,
    categoryId: category.id,
    gearId: gear.id,
  });
});

describe("listCategoryGearQuery", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      listCategoryGearQuery({ type: "INVENTORY" }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("Should return the correct items", async () => {
    const { ctx } = await createMockContext({ user });

    const inventory = await listCategoryGearQuery({ type: "INVENTORY" }, ctx);

    expect(inventory.length).toEqual(2);

    const wishList = await listCategoryGearQuery({ type: "WISH_LIST" }, ctx);

    expect(wishList.length).toEqual(0);
  });
});
