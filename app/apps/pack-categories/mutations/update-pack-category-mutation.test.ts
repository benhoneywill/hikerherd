import type { User, Pack, PackCategory } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";
import createPack from "test/helpers/create-pack";
import createPackCategory from "test/helpers/create-pack-category";

import db from "db";

import updatePackCategoryMutation from "./update-pack-category-mutation";

let user: User;
let pack: Pack;
let category: PackCategory;

beforeEach(async () => {
  user = await createUser();
  pack = await createPack({ userId: user.id });
  category = await createPackCategory({ packId: pack.id });
});

describe("updatePackCategoryMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      updatePackCategoryMutation(
        { id: category.id, name: faker.random.word() },
        ctx
      )
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the category does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      updatePackCategoryMutation(
        { id: faker.datatype.uuid(), name: faker.random.word() },
        ctx
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the category does not belong to the user", async () => {
    const otherUser = await createUser();

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      updatePackCategoryMutation(
        { id: category.id, name: faker.random.word() },
        ctx
      )
    ).rejects.toThrow(AuthorizationError);
  });

  it("Should correctly update the category name", async () => {
    const { ctx } = await createMockContext({ user });

    const name = faker.random.word();

    await updatePackCategoryMutation({ id: category.id, name }, ctx);

    const updated = await db.packCategory.findUnique({
      where: { id: category.id },
    });

    expect(updated?.name).toEqual(name);
  });
});
