import type { User, PackCategory, Pack } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";
import createPack from "test/helpers/create-pack";
import createPackCategory from "test/helpers/create-pack-category";
import getGearData from "test/data/get-gear-data";
import createCategory from "test/helpers/create-category";

import db from "db";

import createPackGearMutation from "./create-pack-gear-mutation";

let user: User;
let pack: Pack;
let category: PackCategory;

const gear = getGearData();

beforeEach(async () => {
  user = await createUser();
  pack = await createPack({ userId: user.id });
  category = await createPackCategory({ packId: pack.id });
});

describe("createPackGearMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      createPackGearMutation({ ...gear, categoryId: category.id }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the category is not found", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      createPackGearMutation(
        { ...gear, categoryId: faker.datatype.uuid() },
        ctx
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the category does not belong to the user", async () => {
    const otherUser = await createUser();

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      createPackGearMutation({ ...gear, categoryId: category.id }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should correctly create the first gear in a category", async () => {
    const { ctx } = await createMockContext({ user });

    const item = await createPackGearMutation(
      { ...gear, categoryId: category.id },
      ctx
    );

    const fetched = await db.packCategoryItem.findUnique({
      where: { id: item.id },
      include: { gear: true },
    });

    expect(fetched?.index).toEqual(0);
    expect(fetched?.gear).toMatchObject(gear);
  });

  it("should create subsequent items with the correct index", async () => {
    const { ctx } = await createMockContext({ user });

    const first = await createPackGearMutation(
      { ...gear, categoryId: category.id },
      ctx
    );

    const second = await createPackGearMutation(
      { ...gear, categoryId: category.id },
      ctx
    );

    const third = await createPackGearMutation(
      { ...gear, categoryId: category.id },
      ctx
    );

    expect(first.index).toEqual(0);
    expect(second.index).toEqual(1);
    expect(third.index).toEqual(2);
  });

  it("should track different categories with different indexes", async () => {
    const { ctx } = await createMockContext({ user });

    const otherCategory = await createPackCategory({ packId: pack.id });

    const first = await createPackGearMutation(
      { ...gear, categoryId: category.id },
      ctx
    );

    const second = await createPackGearMutation(
      { ...gear, categoryId: otherCategory.id },
      ctx
    );

    expect(first?.index).toEqual(0);
    expect(second?.index).toEqual(0);
  });

  it("should also add the new item to the inventory", async () => {
    const { ctx } = await createMockContext({ user });

    const item = await createPackGearMutation(
      { ...gear, categoryId: category.id },
      ctx
    );

    const inventoryCategory = await db.category.findFirst({
      where: { name: category.name },
      include: { items: true },
    });

    expect(inventoryCategory?.index).toEqual(0);
    expect(inventoryCategory?.items.length).toEqual(1);
    expect(inventoryCategory?.items[0]?.gearId).toEqual(item.gearId);
  });

  it("should add the new inventory item an existing category with the same name", async () => {
    const { ctx } = await createMockContext({ user });

    const existingInventoryCategory = await createCategory({
      userId: user.id,
      name: category.name,
    });

    const item = await createPackGearMutation(
      { ...gear, categoryId: category.id },
      ctx
    );

    const inventoryCategory = await db.category.findUnique({
      where: { id: existingInventoryCategory.id },
      include: { items: true },
    });

    expect(inventoryCategory?.items.length).toEqual(1);
    expect(inventoryCategory?.items[0]?.gearId).toEqual(item.gearId);
  });
});
