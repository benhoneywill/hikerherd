import type { User, Category } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import createCategoryGearMutation from "./create-category-gear-mutation";

let user: User;
let category: Category;

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
      userId: user.id,
      type: "INVENTORY",
    },
  });
});

describe("createCategoryGearMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      createCategoryGearMutation(
        { ...GEAR_VALUES, categoryId: category.id },
        ctx
      )
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the category is not found", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      createCategoryGearMutation({ ...GEAR_VALUES, categoryId: "abc123" }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the category does not belong to the user", async () => {
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
        userId: otherUser.id,
        type: "INVENTORY",
      },
    });

    await expect(
      createCategoryGearMutation(
        { ...GEAR_VALUES, categoryId: otherCategory.id },
        ctx
      )
    ).rejects.toThrow(AuthorizationError);
  });

  it("should correctly create the first gear in a category", async () => {
    const { ctx } = await createMockContext({ user });

    const item = await createCategoryGearMutation(
      { ...GEAR_VALUES, categoryId: category.id },
      ctx
    );

    const fetched = await db.categoryItem.findUnique({
      where: { id: item.id },
      include: { gear: true },
    });

    expect(fetched?.index).toEqual(0);
    expect(fetched?.gear).toMatchObject(GEAR_VALUES);
  });

  it("should create subsequent items with the correct index", async () => {
    const { ctx } = await createMockContext({ user });

    const first = await createCategoryGearMutation(
      { ...GEAR_VALUES, categoryId: category.id },
      ctx
    );

    const second = await createCategoryGearMutation(
      { ...GEAR_VALUES, categoryId: category.id },
      ctx
    );

    const third = await createCategoryGearMutation(
      { ...GEAR_VALUES, categoryId: category.id },
      ctx
    );

    expect(first.index).toEqual(0);
    expect(second.index).toEqual(1);
    expect(third.index).toEqual(2);
  });

  it("should track different categories with different indexes", async () => {
    const { ctx } = await createMockContext({ user });

    const otherCategory = await db.category.create({
      data: {
        name: "My 2nd category",
        index: 1,
        userId: user.id,
        type: "INVENTORY",
      },
    });

    const first = await createCategoryGearMutation(
      { ...GEAR_VALUES, categoryId: category.id },
      ctx
    );

    const second = await createCategoryGearMutation(
      { ...GEAR_VALUES, categoryId: otherCategory.id },
      ctx
    );

    expect(first?.index).toEqual(0);
    expect(second?.index).toEqual(0);
  });
});
