import { AuthenticationError, SecurePassword } from "blitz";

import createMockContext from "testing/create-mock-context";

import db from "db";

import loginMutation from "./login-mutation";

const EMAIL = "example@example.com";
const USERNAME = "username";
const PASSWORD = "password12345";

let userId: string = "";

beforeEach(async () => {
  const hashedPassword = await SecurePassword.hash(PASSWORD);

  const user = await db.user.create({
    data: {
      email: EMAIL,
      username: USERNAME,
      hashedPassword,
    },
  });

  userId = user.id;
});

describe("loginMutation", () => {
  it("should error if the password is incorrect", async () => {
    const { ctx } = await createMockContext();
    await expect(
      loginMutation({ email: EMAIL, password: "wrong12345" }, ctx)
    ).rejects.toThrow(AuthenticationError);

    expect(ctx.session.userId).toBe(null);
  });

  it("should return the user and create a session if the password is correct", async () => {
    const { ctx } = await createMockContext();
    await expect(
      loginMutation({ email: EMAIL, password: PASSWORD }, ctx)
    ).resolves.toMatchObject({
      email: EMAIL,
      username: USERNAME,
    });

    expect(ctx.session.userId).toEqual(userId);
  });
});
