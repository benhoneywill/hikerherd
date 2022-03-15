import type { User, Pack, PackCategory } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createPack from "test/factories/create-pack";
import createPackCategory from "test/factories/create-pack-category";

import packCategoryQuery from "./pack-category-query";

let user: User;
let pack: Pack;
let category: PackCategory;

beforeEach(async () => {
  user = await createUser({});
  pack = await createPack({ userId: user.id });
  category = await createPackCategory({ packId: pack.id });
});

describe("packCategoryQuery", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(packCategoryQuery({ id: category.id }, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  it("should error if the category does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      packCategoryQuery({ id: faker.datatype.uuid() }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the category does not belong to the user", async () => {
    const otherUser = await createUser({});

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(packCategoryQuery({ id: category.id }, ctx)).rejects.toThrow(
      AuthorizationError
    );
  });

  it("Should return the category", async () => {
    const { ctx } = await createMockContext({ user });

    const result = await packCategoryQuery({ id: category.id }, ctx);

    expect(result).toMatchObject({
      id: category.id,
      name: category.name,
    });
  });
});
