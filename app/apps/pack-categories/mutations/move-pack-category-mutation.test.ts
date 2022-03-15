import type { User, Pack, PackCategory } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createPack from "test/factories/create-pack";
import createPackCategory from "test/factories/create-pack-category";

import db from "db";

import movePackCategoryMutation from "./move-pack-category-mutation";

let user: User;
let pack: Pack;
let category: PackCategory;

beforeEach(async () => {
  user = await createUser({});
  pack = await createPack({ userId: user.id });
  category = await createPackCategory({ packId: pack.id });
});

describe("movePackCategoryMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      movePackCategoryMutation({ id: category.id, index: 0 }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the category does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      movePackCategoryMutation({ id: faker.datatype.uuid(), index: 0 }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the category does not belong to the user", async () => {
    const otherUser = await createUser({});

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      movePackCategoryMutation({ id: category.id, index: 0 }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("Should correctly update the indexes of all categories", async () => {
    const { ctx } = await createMockContext({ user });

    const cat1 = await createPackCategory({ packId: pack.id, index: 1 });
    const cat2 = await createPackCategory({ packId: pack.id, index: 2 });
    const cat3 = await createPackCategory({ packId: pack.id, index: 3 });

    await movePackCategoryMutation({ id: cat2.id, index: 0 }, ctx);

    const fetched0 = await db.packCategory.findUnique({
      where: { id: category.id },
    });
    const fetched1 = await db.packCategory.findUnique({
      where: { id: cat1.id },
    });
    const fetched2 = await db.packCategory.findUnique({
      where: { id: cat2.id },
    });
    const fetched3 = await db.packCategory.findUnique({
      where: { id: cat3.id },
    });

    expect(fetched0?.index).toEqual(1);
    expect(fetched1?.index).toEqual(2);
    expect(fetched2?.index).toEqual(0);
    expect(fetched3?.index).toEqual(3);
  });
});
