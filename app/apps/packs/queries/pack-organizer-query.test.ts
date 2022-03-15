import type { User, PackCategory, CategoryItem, Pack } from "db";

import { NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createPack from "test/factories/create-pack";
import createPackCategory from "test/factories/create-pack-category";
import createGear from "test/factories/create-gear";
import createPackCategoryItem from "test/factories/create-pack-category-item";

import packOrganizerQuery from "./pack-organizer-query";

let user: User;
let pack: Pack;
let category: PackCategory;
let item: CategoryItem;

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

describe("packOrganizerQuery", () => {
  it("should error if the pack is not found", async () => {
    const { ctx } = await createMockContext();

    await expect(
      packOrganizerQuery({ id: faker.datatype.uuid() }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the pack is private", async () => {
    const { ctx } = await createMockContext();

    const privatePack = await createPack({ userId: user.id, private: true });

    await expect(
      packOrganizerQuery({ id: privatePack.id }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should return the pack if it is private and it belongs to the user", async () => {
    const { ctx } = await createMockContext({ user });

    const privatePack = await createPack({ userId: user.id, private: true });

    const result = await packOrganizerQuery({ id: privatePack.id }, ctx);

    expect(result?.name).toEqual(privatePack.name);
  });

  it("Should return the pack if it is public", async () => {
    const { ctx } = await createMockContext();

    const result = await packOrganizerQuery({ id: pack.id }, ctx);

    expect(result?.name).toEqual(pack.name);
    expect(result.categories[0]?.name).toEqual(category.name);
    expect(result.categories[0]?.items[0]?.id).toEqual(item.id);
  });
});
