import type { User, Category, Gear } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createCategory from "test/factories/create-category";
import createGear from "test/factories/create-gear";
import createCategoryItem from "test/factories/create-category-item";

import db from "db";

import addToInventoryMutation from "./add-to-inventory-mutation";

let user: User;
let otherUser: User;
let category: Category;
let gear: Gear;

beforeEach(async () => {
  user = await createUser({});
  otherUser = await createUser({});
  category = await createCategory({ userId: user.id });
  gear = await createGear({ userId: user.id });
});

describe("addToInventoryMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      addToInventoryMutation({ gearId: gear.id, categoryId: category.id }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the category is not found", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      addToInventoryMutation(
        { gearId: gear.id, categoryId: faker.datatype.uuid() },
        ctx
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the category does not belong to the user", async () => {
    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      addToInventoryMutation({ gearId: gear.id, categoryId: category.id }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should error if the gear is not found", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      addToInventoryMutation(
        { gearId: faker.datatype.uuid(), categoryId: category.id },
        ctx
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("should correctly clone the gear and add it to the category", async () => {
    const { ctx } = await createMockContext({ user });

    const item = await addToInventoryMutation(
      { gearId: gear.id, categoryId: category.id },
      ctx
    );

    const fetched = await db.categoryItem.findUnique({
      where: { id: item.id },
      include: { gear: true },
    });

    expect(fetched?.index).toEqual(0);
    expect(fetched?.gear).toMatchObject({
      name: gear.name,
      weight: gear.weight,
      clonedFromId: gear.id,
    });
    expect(fetched?.categoryId).toEqual(category.id);
  });

  it("should correctly set the item's index", async () => {
    const { ctx } = await createMockContext({ user });

    await createCategoryItem({
      categoryId: category.id,
      gearId: gear.id,
      index: 0,
    });

    const item = await addToInventoryMutation(
      { gearId: gear.id, categoryId: category.id },
      ctx
    );

    const fetched = await db.categoryItem.findUnique({
      where: { id: item.id },
      include: { gear: true },
    });

    expect(fetched?.index).toEqual(1);
  });
});
