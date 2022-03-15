import type { User, Pack } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createPack from "test/factories/create-pack";
import createPackCategory from "test/factories/create-pack-category";

import createPackCategoryMutation from "./create-pack-category-mutation";

let user: User;
let pack: Pack;

beforeEach(async () => {
  user = await createUser({});
  pack = await createPack({ userId: user.id });
});

describe("createPackCategoryMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      createPackCategoryMutation(
        { name: faker.random.word(), packId: pack.id },
        ctx
      )
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the pack does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      createPackCategoryMutation(
        { name: faker.random.word(), packId: faker.datatype.uuid() },
        ctx
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the pack does not belong to the user", async () => {
    const otherUser = await createUser({});

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      createPackCategoryMutation(
        { name: faker.random.word(), packId: pack.id },
        ctx
      )
    ).rejects.toThrow(AuthorizationError);
  });

  it("should correctly create a first category", async () => {
    const { ctx } = await createMockContext({ user });

    const name = faker.random.word();

    const category = await createPackCategoryMutation(
      { name, packId: pack.id },
      ctx
    );

    expect(category?.index).toEqual(0);
    expect(category?.name).toEqual(name);
  });

  it("should create subsequent categories with the correct index", async () => {
    const { ctx } = await createMockContext({ user });

    await createPackCategory({ packId: pack.id, index: 0 });
    await createPackCategory({ packId: pack.id, index: 1 });

    const category = await createPackCategoryMutation(
      { name: faker.random.word(), packId: pack.id },
      ctx
    );

    expect(category?.index).toEqual(2);
  });
});
