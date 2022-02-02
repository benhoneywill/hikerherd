import type { User, PackCategory, PackCategoryItem, Pack } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import updatePackGearMutation from "./update-pack-gear-mutations";

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

describe("updatePackGearMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      updatePackGearMutation({ id: item.id, ...GEAR_VALUES }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the item does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      updatePackGearMutation({ id: "abc123", ...GEAR_VALUES }, ctx)
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
      updatePackGearMutation({ id: item.id, ...GEAR_VALUES }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should update the item", async () => {
    const { ctx } = await createMockContext({ user });

    await updatePackGearMutation(
      { id: item.id, ...GEAR_VALUES, name: "updated" },
      ctx
    );

    const fetchedItem = await db.packCategoryItem.findUnique({
      where: { id: item.id },
      include: { gear: true },
    });

    expect(fetchedItem?.gear.name).toEqual("updated");
  });
});
