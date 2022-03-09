import type { User } from "db";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";

import logoutMutation from "./logout-mutation";

let user: User;

beforeEach(async () => {
  user = await createUser();
});

describe("logoutMutation", () => {
  it("should revoke the session", async () => {
    const { ctx } = await createMockContext({ user });
    await expect(logoutMutation({}, ctx)).resolves.toEqual(undefined);
    expect(ctx.session.userId).toEqual(null);
  });
});
