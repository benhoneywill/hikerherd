import type { User, PackCategory, Pack } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import createPackGearMutation from "./create-pack-gear-mutation";

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
});

describe("createPackGearMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      createPackGearMutation({ ...GEAR_VALUES, categoryId: category.id }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the category is not found", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      createPackGearMutation({ ...GEAR_VALUES, categoryId: "abc123" }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the category does not belong to the user", async () => {
    const otherUser = await db.user.create({
      data: {
        email: "example2@hikerherd.com",
        username: "testuser2",
        hashedPassword: "fakehash",
      },
    });

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      createPackGearMutation({ ...GEAR_VALUES, categoryId: category.id }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should correctly create the first gear in a category", async () => {
    const { ctx } = await createMockContext({ user });

    const item = await createPackGearMutation(
      { ...GEAR_VALUES, categoryId: category.id },
      ctx
    );

    const fetched = await db.packCategoryItem.findUnique({
      where: { id: item.id },
      include: { gear: true },
    });

    expect(fetched?.index).toEqual(0);
    expect(fetched?.gear).toMatchObject(GEAR_VALUES);
  });

  it("should create subsequent items with the correct index", async () => {
    const { ctx } = await createMockContext({ user });

    const first = await createPackGearMutation(
      { ...GEAR_VALUES, categoryId: category.id },
      ctx
    );

    const second = await createPackGearMutation(
      { ...GEAR_VALUES, categoryId: category.id },
      ctx
    );

    const third = await createPackGearMutation(
      { ...GEAR_VALUES, categoryId: category.id },
      ctx
    );

    expect(first.index).toEqual(0);
    expect(second.index).toEqual(1);
    expect(third.index).toEqual(2);
  });

  it("should track different categories with different indexes", async () => {
    const { ctx } = await createMockContext({ user });

    const otherCategory = await db.packCategory.create({
      data: {
        name: "My 2nd category",
        index: 1,
        packId: pack.id,
      },
    });

    const first = await createPackGearMutation(
      { ...GEAR_VALUES, categoryId: category.id },
      ctx
    );

    const second = await createPackGearMutation(
      { ...GEAR_VALUES, categoryId: otherCategory.id },
      ctx
    );

    expect(first?.index).toEqual(0);
    expect(second?.index).toEqual(0);
  });
});
