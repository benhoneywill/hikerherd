import type { User, PackCategory, Pack, Gear } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import addGearToPackMutation from "./add-gear-to-pack-mutation";

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
let gear: Gear;

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

  gear = await db.gear.create({
    data: {
      ...GEAR_VALUES,
      userId: user.id,
    },
  });
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
      addGearToPackMutation({ gearId: gear.id, categoryId: "abc123" }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the gear is not found", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      addGearToPackMutation({ gearId: "abc123", categoryId: category.id }, ctx)
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
      addGearToPackMutation({ gearId: gear.id, categoryId: category.id }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should clone the gear and add it to the pack category", async () => {
    const { ctx } = await createMockContext({ user });

    const otherUser = await db.user.create({
      data: {
        email: "other@hikerherd.com",
        username: "otheruser",
        hashedPassword: "fakehash",
      },
    });

    const otherGear = await db.gear.create({
      data: {
        ...GEAR_VALUES,
        userId: otherUser.id,
      },
    });

    const created = await addGearToPackMutation(
      { gearId: otherGear.id, categoryId: category.id },
      ctx
    );

    const clone = await db.gear.findFirst({
      where: { clonedFromId: otherGear.id },
    });

    expect(clone?.name).toEqual(gear.name);

    const item = await db.packCategoryItem.findFirst({
      where: { id: created.id },
    });

    expect(item?.gearId).toEqual(clone?.id);
    expect(item?.index).toEqual(0);
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

    await db.packCategoryItem.createMany({
      data: [
        { categoryId: category.id, gearId: gear.id, index: 0, worn: false },
        { categoryId: category.id, gearId: gear.id, index: 1, worn: false },
        { categoryId: category.id, gearId: gear.id, index: 2, worn: false },
      ],
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
});
