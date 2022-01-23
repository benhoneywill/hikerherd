import createMockContext from "testing/create-mock-context";

import db from "db";

import logoutMutation from "./logout-mutation";

describe("logoutMutation", () => {
  it("should revoke the session", async () => {
    const user = await db.user.create({
      data: {
        username: "example",
        email: "example@example.com",
      },
    });

    const { ctx } = await createMockContext({ user });
    await expect(logoutMutation({}, ctx)).resolves.toEqual(undefined);
    expect(ctx.session.userId).toEqual(null);
  });
});
