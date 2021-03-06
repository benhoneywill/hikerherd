import type { User, Pack } from "db";

import { AuthenticationError } from "blitz";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createPack from "test/factories/create-pack";

import packsQuery from "./packs-query";

let user: User;
let pack: Pack;

beforeEach(async () => {
  user = await createUser({});
  pack = await createPack({ userId: user.id });
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
