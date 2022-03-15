import type { User, PackCategory, PackCategoryItem, Pack } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createPack from "test/factories/create-pack";
import createPackCategory from "test/factories/create-pack-category";
import createGear from "test/factories/create-gear";
import createPackCategoryItem from "test/factories/create-pack-category-item";
import getGearData from "test/data/get-gear-data";

import db from "db";

import updatePackGearMutation from "./update-pack-gear-mutations";

let user: User;
let pack: Pack;
let category: PackCategory;
let item: PackCategoryItem;

const gear = getGearData();

beforeEach(async () => {
  user = await createUser({});
  pack = await createPack({ userId: user.id });
  category = await createPackCategory({ packId: pack.id });

  const gear = await createGear({ userId: user.id });
  item = await createPackCategoryItem({
    categoryId: category.id,
    gearId: gear.id,
  });
});

describe("updatePackGearMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      updatePackGearMutation({ id: item.id, ...gear }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the item does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      updatePackGearMutation({ id: faker.datatype.uuid(), ...gear }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the item does not belong to the user", async () => {
    const otherUser = await createUser({});

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      updatePackGearMutation({ id: item.id, ...gear }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should update the item", async () => {
    const { ctx } = await createMockContext({ user });

    const name = faker.random.word();

    await updatePackGearMutation({ id: item.id, ...gear, name }, ctx);

    const fetchedItem = await db.packCategoryItem.findUnique({
      where: { id: item.id },
      include: { gear: true },
    });

    expect(fetchedItem?.gear.name).toEqual(name);
  });
});
