import type { User, Pack, PackCategory } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createPack from "test/factories/create-pack";
import createPackCategory from "test/factories/create-pack-category";

import db from "db";

import deletePackCategoryMutation from "./delete-pack-category-mutation";

let user: User;
let pack: Pack;
let category: PackCategory;

beforeEach(async () => {
  user = await createUser({});
  pack = await createPack({ userId: user.id });
  category = await createPackCategory({ packId: pack.id });
});

describe("deletePackCategoryMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      deletePackCategoryMutation({ id: category.id }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the category does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      deletePackCategoryMutation({ id: faker.datatype.uuid() }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the category does not belong to the user", async () => {
    const otherUser = await createUser({});

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      deletePackCategoryMutation({ id: category.id }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should delete the category", async () => {
    const { ctx } = await createMockContext({ user });

    await deletePackCategoryMutation({ id: category.id }, ctx);

    const fetchedCategory = await db.packCategory.findUnique({
      where: { id: category.id },
    });

    await expect(fetchedCategory).toEqual(null);
  });

  it("should change the indexes of the categories correctly", async () => {
    const { ctx } = await createMockContext({ user });

    const cat1 = await createPackCategory({ packId: pack.id, index: 1 });
    const cat2 = await createPackCategory({ packId: pack.id, index: 2 });
    const cat3 = await createPackCategory({ packId: pack.id, index: 3 });

    await deletePackCategoryMutation({ id: cat1.id }, ctx);

    const fetched0 = await db.packCategory.findUnique({
      where: { id: category.id },
    });
    const fetched2 = await db.packCategory.findUnique({
      where: { id: cat2.id },
    });
    const fetched3 = await db.packCategory.findUnique({
      where: { id: cat3.id },
    });

    expect(fetched0?.index).toEqual(0);
    expect(fetched2?.index).toEqual(1);
    expect(fetched3?.index).toEqual(2);
  });
});
