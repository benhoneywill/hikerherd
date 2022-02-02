import type { User, Pack, PackCategory, PackCategoryItem } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import deletePackGearMutation from "./delete-pack-gear-mutation";

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
  user = await db.user.create({
    data: {
      email: "example@hikerherd.com",
      username: "testuser",
      hashedPassword: "fakehash",
    },
  });

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

describe("deletePackGearMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(deletePackGearMutation({ id: item.id }, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  it("should error if the item does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(deletePackGearMutation({ id: "abc123" }, ctx)).rejects.toThrow(
      NotFoundError
    );
  });

  it("should error if the item does not belong to the user", async () => {
    const otherUser = await db.user.create({
      data: {
        email: "example2@hikerherd.com",
        username: "testuser2",
        hashedPassword: "fakehash",
      },
    });

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(deletePackGearMutation({ id: item.id }, ctx)).rejects.toThrow(
      AuthorizationError
    );
  });

  it("should delete the item", async () => {
    const { ctx } = await createMockContext({ user });

    await deletePackGearMutation({ id: item.id }, ctx);

    const fetchedItem = await db.packCategoryItem.findUnique({
      where: { id: item.id },
    });

    await expect(fetchedItem).toEqual(null);
  });

  it("should change the indexes of the other items correctly", async () => {
    const { ctx } = await createMockContext({ user });

    const item2 = await db.packCategoryItem.create({
      data: {
        index: 1,
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

    const item3 = await db.packCategoryItem.create({
      data: {
        index: 2,
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

    await deletePackGearMutation({ id: item2.id }, ctx);

    const fetchedItem1 = await db.packCategoryItem.findUnique({
      where: { id: item.id },
    });
    const fetchedItem3 = await db.packCategoryItem.findUnique({
      where: { id: item3.id },
    });

    expect(fetchedItem1?.index).toEqual(0);
    expect(fetchedItem3?.index).toEqual(1);
  });

  it("should delete the associated gear if there are no clones or inventory items", async () => {
    const { ctx } = await createMockContext({ user });

    await deletePackGearMutation({ id: item.id }, ctx);

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

    await deletePackGearMutation({ id: item.id }, ctx);

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

    await deletePackGearMutation({ id: item.id }, ctx);

    const gear = await db.gear.findUnique({ where: { id: item.gearId } });

    expect(gear?.id).toEqual(item.gearId);
  });
});
