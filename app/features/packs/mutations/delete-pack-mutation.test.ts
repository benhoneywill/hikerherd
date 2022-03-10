import type { User, Pack, PackCategory, PackCategoryItem } from "db";

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

import deletePackMutation from "./delete-pack-mutation";

let user: User;
let pack: Pack;
let category: PackCategory;
let item: PackCategoryItem;

beforeEach(async () => {
  user = await createUser();
  pack = await createPack({ userId: user.id });
  category = await createPackCategory({ packId: pack.id });

  const gear = await createGear({ userId: user.id });
  item = await createPackCategoryItem({
    categoryId: category.id,
    gearId: gear.id,
  });
});

describe("deletePackMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(deletePackMutation({ id: pack.id }, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  it("should error if the pack does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      deletePackMutation({ id: faker.datatype.uuid() }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the pack does not belong to the user", async () => {
    const otherUser = await createUser();

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(deletePackMutation({ id: pack.id }, ctx)).rejects.toThrow(
      AuthorizationError
    );
  });

  it("should delete the pack", async () => {
    const { ctx } = await createMockContext({ user });

    await deletePackMutation({ id: pack.id }, ctx);

    const fetchedPack = await db.pack.findUnique({
      where: { id: pack.id },
    });

    await expect(fetchedPack).toEqual(null);
  });

  it("should delete the associated gear if there are no clones or inventory items", async () => {
    const { ctx } = await createMockContext({ user });

    await deletePackMutation({ id: pack.id }, ctx);

    const gear = await db.gear.findUnique({ where: { id: item.gearId } });

    expect(gear).toEqual(null);
  });

  it("should not delete the associated gear if there are clones", async () => {
    const { ctx } = await createMockContext({ user });

    await createGear({ userId: user.id, clonedFromId: item.gearId });

    await deletePackMutation({ id: pack.id }, ctx);

    const gear = await db.gear.findUnique({ where: { id: item.gearId } });

    expect(gear?.id).toEqual(item.gearId);
  });

  it("should not delete the associated gear if there are inventory items", async () => {
    const { ctx } = await createMockContext({ user });

    const inventoryCategory = await createCategory({ userId: user.id });

    await createCategoryItem({
      categoryId: inventoryCategory.id,
      gearId: item.gearId,
    });

    await deletePackMutation({ id: pack.id }, ctx);

    const gear = await db.gear.findUnique({ where: { id: item.gearId } });

    expect(gear?.id).toEqual(item.gearId);
  });

  it("should delete the pack categories", async () => {
    const { ctx } = await createMockContext({ user });

    await deletePackMutation({ id: pack.id }, ctx);

    const fetchedCategory = await db.packCategory.findUnique({
      where: { id: category.id },
    });

    expect(fetchedCategory).toEqual(null);
  });
});
