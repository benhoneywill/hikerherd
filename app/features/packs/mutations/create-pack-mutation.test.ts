import type { User } from "db";

import { AuthenticationError } from "blitz";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";

import db from "db";

import createPackMutation from "./create-pack-mutation";

let user: User;

beforeEach(async () => {
  user = await createUser();
});

describe("createPackMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      createPackMutation({ name: "My pack", notes: null }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should correctly create a pack", async () => {
    const { ctx } = await createMockContext({ user });

    const pack = await createPackMutation(
      { name: "My pack", notes: null },
      ctx
    );

    const fetched = await db.pack.findUnique({ where: { id: pack.id } });

    expect(fetched?.name).toEqual("My pack");
  });
});
