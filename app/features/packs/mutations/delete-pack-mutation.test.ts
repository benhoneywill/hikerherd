import type { User, Pack, PackCategory, PackCategoryItem } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";

import db from "db";

import deletePackMutation from "./delete-pack-mutation";

const GEAR_VALUES = {
  name: "My gear",
  weight: 100,
  imageUrl: "https://example.com/example.png",
  link: "https://example.com/",
  notes: "Nice gear, use it a lot",
  consumable: false,
  price: 10000,
  currency: "GBP",
} as const;

let user: User;
let pack: Pack;
let category: PackCategory;
let item: PackCategoryItem;

beforeEach(async () => {
  user = await createUser();

  pack = await db.pack.create({
    data: {
      name: "My Pack",
      slug: "my-pack",
      userId: user.id,
      notes: null,
    },
  });

  category = await db.packCategory.create({
    data: {
      name: "My category",
      index: 0,
      packId: pack.id,
    },
  });

  item = await db.packCategoryItem.create({
    data: {
      index: 0,
      worn: false,
      category: {
        connect: {
          id: category.id,
        },
      },
      gear: {
        create: {
          ...GEAR_VALUES,
          userId: user.id,
        },
      },
    },
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

    await expect(deletePackMutation({ id: "abc123" }, ctx)).rejects.toThrow(
      NotFoundError
    );
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

    await db.gear.create({
      data: {
        ...GEAR_VALUES,
        userId: user.id,
        clonedFromId: item.gearId,
      },
    });

    await deletePackMutation({ id: pack.id }, ctx);

    const gear = await db.gear.findUnique({ where: { id: item.gearId } });

    expect(gear?.id).toEqual(item.gearId);
  });

  it("should not delete the associated gear if there are inventory items", async () => {
    const { ctx } = await createMockContext({ user });

    const inventoryCategory = await db.category.create({
      data: {
        index: 0,
        type: "INVENTORY",
        userId: user.id,
        name: "My Category",
      },
    });

    await db.categoryItem.create({
      data: {
        index: 0,
        gearId: item.gearId,
        categoryId: inventoryCategory.id,
      },
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
