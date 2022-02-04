import type { User, Pack } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import packQuery from "./pack-query";

let user: User;
let pack: Pack;

beforeEach(async () => {
  user = await db.user.create({
    data: {
      email: "example@hikerherd.com",
      username: "testuser",
      hashedPassword: "fakehash",
    },
  });

  pack = await db.pack.create({
    data: {
      name: "My Pack",
      slug: "my-pack",
      notes: null,
      userId: user.id,
    },
  });
});

describe("packQuery", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(packQuery({ id: pack.id }, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  it("should error if the pack is not found", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(packQuery({ id: "abc123" }, ctx)).rejects.toThrow(
      NotFoundError
    );
  });

  it("should error if the pack is does not belong to the user", async () => {
    const otherUser = await db.user.create({
      data: {
        email: "other@hikerherd.com",
        username: "otheruser",
        hashedPassword: "fakehash",
      },
    });

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(packQuery({ id: pack.id }, ctx)).rejects.toThrow(
      AuthorizationError
    );
  });

  it("Should return the pack", async () => {
    const { ctx } = await createMockContext({ user });

    const result = await packQuery({ id: pack.id }, ctx);

    expect(result.name).toEqual(pack.name);
  });
});