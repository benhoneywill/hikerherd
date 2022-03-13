import type { User, Pack } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";
import createPack from "test/helpers/create-pack";

import db from "db";

import updatePackMutation from "./update-pack-mutation";

let user: User;
let pack: Pack;

beforeEach(async () => {
  user = await createUser();
  pack = await createPack({ userId: user.id });
});

describe("updatePackMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      updatePackMutation(
        { id: pack.id, name: faker.random.word(), notes: null },
        ctx
      )
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the pack does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      updatePackMutation(
        { id: faker.datatype.uuid(), name: faker.random.word(), notes: null },
        ctx
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the pack does not belong to the user", async () => {
    const otherUser = await createUser();

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      updatePackMutation(
        { id: pack.id, name: faker.random.word(), notes: null },
        ctx
      )
    ).rejects.toThrow(AuthorizationError);
  });

  it("should update the pack", async () => {
    const { ctx } = await createMockContext({ user });

    const name = faker.random.word();

    await updatePackMutation({ id: pack.id, name, notes: null }, ctx);

    const fetchedPack = await db.pack.findUnique({
      where: { id: pack.id },
    });

    expect(fetchedPack?.name).toEqual(name);
  });
});
