import type { User, PackCategory, PackCategoryItem, Pack } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import updatePackGearQuantityMutation from "./update-pack-gear-quantity-mutation";

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

describe("updatePackGearQuantityMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      updatePackGearQuantityMutation({ id: item.id, type: "increment" }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the item does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      updatePackGearQuantityMutation({ id: "abc123", type: "increment" }, ctx)
    ).rejects.toThrow(NotFoundError);
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

    await expect(
      updatePackGearQuantityMutation({ id: item.id, type: "increment" }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should update the item quantity", async () => {
    const { ctx } = await createMockContext({ user });

    await updatePackGearQuantityMutation(
      { id: item.id, type: "increment" },
      ctx
    );

    const fetch1 = await db.packCategoryItem.findUnique({
      where: { id: item.id },
    });

    expect(fetch1?.quantity).toEqual(2);

    await updatePackGearQuantityMutation(
      { id: item.id, type: "decrement" },
      ctx
    );

    const fetch2 = await db.packCategoryItem.findUnique({
      where: { id: item.id },
    });

    expect(fetch2?.quantity).toEqual(1);
  });

  it("should error if you decrement below 0", async () => {
    const { ctx } = await createMockContext({ user });

    // decrement to 0
    await updatePackGearQuantityMutation(
      { id: item.id, type: "decrement" },
      ctx
    );

    // try to go below 0
    await expect(
      updatePackGearQuantityMutation({ id: item.id, type: "decrement" }, ctx)
    ).rejects.toThrow();
  });
});
