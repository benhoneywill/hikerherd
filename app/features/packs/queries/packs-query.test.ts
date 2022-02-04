import type { User, Pack } from "db";

import { AuthenticationError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import packsQuery from "./packs-query";

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

describe("packsQuery", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(packsQuery({}, ctx)).rejects.toThrow(AuthenticationError);
  });

  it("Should return the users packs", async () => {
    const { ctx } = await createMockContext({ user });

    const result = await packsQuery({}, ctx);

    expect(result[0]?.name).toEqual(pack.name);
  });
});
