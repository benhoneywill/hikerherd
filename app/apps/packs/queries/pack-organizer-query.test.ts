import type { User, PackCategory, CategoryItem, Pack } from "db";

import { NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";
import createPack from "test/helpers/create-pack";
import createPackCategory from "test/helpers/create-pack-category";
import createGear from "test/helpers/create-gear";
import createPackCategoryItem from "test/helpers/create-pack-category-item";

import packOrganizerQuery from "./pack-organizer-query";

let user: User;
let pack: Pack;
let category: PackCategory;
let item: CategoryItem;

beforeEach(async () => {
  user = await createUser();
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

  it("Should return the pack", async () => {
    const { ctx } = await createMockContext({ user });

    const result = await packOrganizerQuery({ id: pack.id }, ctx);

    expect(result?.name).toEqual(pack.name);
    expect(result.categories[0]?.name).toEqual(category.name);
    expect(result.categories[0]?.items[0]?.id).toEqual(item.id);
  });
});
