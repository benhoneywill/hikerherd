import type { User, Pack } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import updatePackMutation from "./update-pack-mutation";

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
      userId: user.id,
      notes: null,
    },
  });
});

describe("updatePackMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      updatePackMutation({ id: pack.id, name: "updated", notes: null }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the pack does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      updatePackMutation({ id: "abc123", name: "updated", notes: null }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the pack does not belong to the user", async () => {
    const otherUser = await db.user.create({
      data: {
        email: "example2@hikerherd.com",
        username: "testuser2",
        hashedPassword: "fakehash",
      },
    });

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      updatePackMutation({ id: pack.id, name: "updated", notes: null }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should update the pack", async () => {
    const { ctx } = await createMockContext({ user });

    await updatePackMutation(
      { id: pack.id, name: "updated", notes: null },
      ctx
    );

    const fetchedPack = await db.pack.findUnique({
      where: { id: pack.id },
    });

    expect(fetchedPack?.name).toEqual("updated");
  });
});
