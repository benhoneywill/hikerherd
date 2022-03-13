import type { User, PackCategory, Pack, Gear } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";
import createPack from "test/helpers/create-pack";
import createPackCategory from "test/helpers/create-pack-category";
import createGear from "test/helpers/create-gear";
import createPackCategoryItem from "test/helpers/create-pack-category-item";
import createCategory from "test/helpers/create-category";
import createCategoryItem from "test/helpers/create-category-item";

import db from "db";

import addGearToPackMutation from "./add-gear-to-pack-mutation";

let user: User;
let pack: Pack;
let category: PackCategory;
let gear: Gear;

beforeEach(async () => {
  user = await createUser();
  pack = await createPack({ userId: user.id });
  category = await createPackCategory({ packId: pack.id });
  gear = await createGear({ userId: user.id });
});

describe("addGearToPackMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      addGearToPackMutation({ gearId: gear.id, categoryId: category.id }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the category is not found", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      addGearToPackMutation(
        { gearId: gear.id, categoryId: faker.datatype.uuid() },
        ctx
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the gear is not found", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      addGearToPackMutation(
        { gearId: faker.datatype.uuid(), categoryId: category.id },
        ctx
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the category does not belong to the user", async () => {
    const otherUser = await createUser();

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      addGearToPackMutation({ gearId: gear.id, categoryId: category.id }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should clone the gear and add it to the pack category", async () => {
    const { ctx } = await createMockContext({ user });

    const otherUser = await createUser();
    const otherGear = await createGear({ userId: otherUser.id });

    const created = await addGearToPackMutation(
      { gearId: otherGear.id, categoryId: category.id },
      ctx
    );

    const clone = await db.gear.findFirst({
      where: { clonedFromId: otherGear.id },
    });

    expect(clone?.name).toEqual(otherGear.name);

    const item = await db.packCategoryItem.findFirst({
      where: { id: created.id },
    });

    expect(item?.gearId).toEqual(clone?.id);
  });

  it("should not clone the gear if it is the own user's gear", async () => {
    const { ctx } = await createMockContext({ user });

    const created = await addGearToPackMutation(
      { gearId: gear.id, categoryId: category.id },
      ctx
    );

    const clone = await db.gear.findFirst({
      where: { clonedFromId: gear.id },
    });

    expect(clone).toEqual(null);

    const item = await db.packCategoryItem.findFirst({
      where: { id: created.id },
    });

    expect(item?.gearId).toEqual(gear?.id);
  });

  it("should correctly set the index of the new item", async () => {
    const { ctx } = await createMockContext({ user });

    await createPackCategoryItem({
      categoryId: category.id,
      gearId: gear.id,
      index: 0,
    });
    await createPackCategoryItem({
      categoryId: category.id,
      gearId: gear.id,
      index: 1,
    });
    await createPackCategoryItem({
      categoryId: category.id,
      gearId: gear.id,
      index: 2,
    });

    const created = await addGearToPackMutation(
      { gearId: gear.id, categoryId: category.id },
      ctx
    );

    const item = await db.packCategoryItem.findFirst({
      where: { id: created.id },
    });

    expect(item?.index).toEqual(3);
  });

  it("should also add the new item to the inventory", async () => {
    const { ctx } = await createMockContext({ user });

    const item = await addGearToPackMutation(
      { gearId: gear.id, categoryId: category.id },
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

    const item = await addGearToPackMutation(
      { gearId: gear.id, categoryId: category.id },
      ctx
    );

    const inventoryCategory = await db.category.findUnique({
      where: { id: existingInventoryCategory.id },
      include: { items: true },
    });

    expect(inventoryCategory?.items.length).toEqual(1);
    expect(inventoryCategory?.items[0]?.gearId).toEqual(item.gearId);
  });

  it("should not add to the inventory if the gear is already there", async () => {
    const { ctx } = await createMockContext({ user });

    const existingInventoryCategory = await createCategory({
      userId: user.id,
      name: category.name,
    });

    await createCategoryItem({
      categoryId: existingInventoryCategory.id,
      gearId: gear.id,
    });

    await addGearToPackMutation(
      { gearId: gear.id, categoryId: category.id },
      ctx
    );

    const inventoryCount = await db.categoryItem.count();

    expect(inventoryCount).toEqual(1);
  });
});
