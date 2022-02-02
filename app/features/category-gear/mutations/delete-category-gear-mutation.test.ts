import type { User, Category, CategoryItem } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import deleteCategoryGearMutation from "./delete-category-gear-mutation";

let user: User;
let category: Category;
let item: CategoryItem;

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

beforeEach(async () => {
  user = await db.user.create({
    data: {
      email: "example@hikerherd.com",
      username: "testuser",
      hashedPassword: "fakehash",
    },
  });

  category = await db.category.create({
    data: {
      name: "My category",
      index: 0,
      type: "INVENTORY",
      userId: user.id,
    },
  });

  item = await db.categoryItem.create({
    data: {
      index: 0,
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

describe("deleteCategoryGearMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      deleteCategoryGearMutation({ id: item.id }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the item does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      deleteCategoryGearMutation({ id: "abc123" }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the item does not belong to the user", async () => {
    const { ctx } = await createMockContext({ user });

    const otherUser = await db.user.create({
      data: {
        email: "example2@hikerherd.com",
        username: "testuser2",
        hashedPassword: "fakehash",
      },
    });

    const otherCategory = await db.category.create({
      data: {
        name: "My category",
        index: 0,
        type: "INVENTORY",
        userId: otherUser.id,
      },
    });

    const otherItem = await db.categoryItem.create({
      data: {
        index: 0,
        category: {
          connect: {
            id: otherCategory.id,
          },
        },
        gear: {
          create: {
            ...GEAR_VALUES,
            userId: otherUser.id,
          },
        },
      },
    });

    await expect(
      deleteCategoryGearMutation({ id: otherItem.id }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should delete the item", async () => {
    const { ctx } = await createMockContext({ user });

    await deleteCategoryGearMutation({ id: item.id }, ctx);

    const fetchedItem = await db.categoryItem.findUnique({
      where: { id: item.id },
    });

    await expect(fetchedItem).toEqual(null);
  });

  it("should change the indexes of the other items correctly", async () => {
    const { ctx } = await createMockContext({ user });

    const item2 = await db.categoryItem.create({
      data: {
        index: 1,
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

    const item3 = await db.categoryItem.create({
      data: {
        index: 2,
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

    await deleteCategoryGearMutation({ id: item2.id }, ctx);

    const fetchedItem1 = await db.categoryItem.findUnique({
      where: { id: item.id },
    });
    const fetchedItem3 = await db.categoryItem.findUnique({
      where: { id: item3.id },
    });

    expect(fetchedItem1?.index).toEqual(0);
    expect(fetchedItem3?.index).toEqual(1);
  });

  it("should delete the associated gear if there are no clones or pack items", async () => {
    const { ctx } = await createMockContext({ user });

    await deleteCategoryGearMutation({ id: item.id }, ctx);

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

    await deleteCategoryGearMutation({ id: item.id }, ctx);

    const gear = await db.gear.findUnique({ where: { id: item.gearId } });

    expect(gear?.id).toEqual(item.gearId);
  });

  it("should not delete the associated gear if there are pack items", async () => {
    const { ctx } = await createMockContext({ user });

    const pack = await db.pack.create({
      data: {
        name: "My pack",
        slug: "my-pack",
        userId: user.id,
      },
    });

    const packCategory = await db.packCategory.create({
      data: {
        packId: pack.id,
        index: 0,
        name: "My Pack Category",
      },
    });

    await db.packCategoryItem.create({
      data: {
        index: 0,
        gearId: item.gearId,
        worn: false,
        quantity: 1,
        categoryId: packCategory.id,
      },
    });

    await deleteCategoryGearMutation({ id: item.id }, ctx);

    const gear = await db.gear.findUnique({ where: { id: item.gearId } });

    expect(gear?.id).toEqual(item.gearId);
  });
});
