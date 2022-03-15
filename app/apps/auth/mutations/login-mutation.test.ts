import type { User } from "db";

import { AuthenticationError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";

import loginMutation from "./login-mutation";

let user: User;
const password = faker.internet.password();

beforeEach(async () => {
  user = await createUser({ password });
});

describe("loginMutation", () => {
  it("should error if the password is incorrect", async () => {
    const { ctx } = await createMockContext();
    await expect(
      loginMutation(
        { email: user.email, password: faker.internet.password() },
        ctx
      )
    ).rejects.toThrow(AuthenticationError);

    expect(ctx.session.userId).toBe(null);
  });

  it("should return the user and create a session if the password is correct", async () => {
    const { ctx } = await createMockContext();
    await expect(
      loginMutation({ email: user.email, password }, ctx)
    ).resolves.toMatchObject({
      email: user.email,
      username: user.username,
    });

    expect(ctx.session.userId).toEqual(user.id);
  });
});
