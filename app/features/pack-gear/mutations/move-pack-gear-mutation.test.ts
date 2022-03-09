import type { User, Pack, PackCategory, PackCategoryItem } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";

import db from "db";

import movePackGearMutation from "./move-pack-gear-mutation";

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
let category1: PackCategory;
let category2: PackCategory;
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

  category1 = await db.packCategory.create({
    data: {
      name: "Category 1",
      index: 0,
      packId: pack.id,
    },
  });

  category2 = await db.packCategory.create({
    data: {
      name: "Category 2",
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
          id: category1.id,
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

describe("movePackGearMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      movePackGearMutation(
        { id: item.id, categoryId: category2.id, index: 0 },
        ctx
      )
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the item does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      movePackGearMutation(
        { id: "abc123", categoryId: category2.id, index: 0 },
        ctx
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the item does not belong to the user", async () => {
    const otherUser = await createUser();

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      movePackGearMutation(
        { id: item.id, categoryId: category2.id, index: 0 },
        ctx
      )
    ).rejects.toThrow(AuthorizationError);
  });

  it("should error if the destination category does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      movePackGearMutation({ id: item.id, categoryId: "abc123", index: 0 }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the destination category does not belong to the user", async () => {
    const otherUser = await createUser();

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      movePackGearMutation(
        { id: item.id, categoryId: category2.id, index: 0 },
        ctx
      )
    ).rejects.toThrow(AuthorizationError);
  });

  it("should update the category and indexes of items correctly", async () => {
    const { ctx } = await createMockContext({ user });

    const item2 = await db.packCategoryItem.create({
      data: {
        index: 0,
        worn: false,
        category: {
          connect: {
            id: category2.id,
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
        index: 1,
        worn: false,
        category: {
          connect: {
            id: category1.id,
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

    await movePackGearMutation(
      { id: item.id, categoryId: category2.id, index: 0 },
      ctx
    );

    const fetchedItem = await db.packCategoryItem.findUnique({
      where: { id: item.id },
    });
    const fetchedItem2 = await db.packCategoryItem.findUnique({
      where: { id: item2.id },
    });
    const fetchedItem3 = await db.packCategoryItem.findUnique({
      where: { id: item3.id },
    });

    expect(fetchedItem?.categoryId).toEqual(category2.id);
    expect(fetchedItem?.index).toEqual(0);
    expect(fetchedItem2?.index).toEqual(1);
    expect(fetchedItem3?.index).toEqual(0);
  });
});
