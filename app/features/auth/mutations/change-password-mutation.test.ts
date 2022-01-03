import type { User } from "db";

import { AuthenticationError, SecurePassword } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import authenticateOrError from "../helpers/authenticate-or-error";

import changePasswordMutation from "./change-password-mutation";

const EMAIL = "example@example.com";
const USERNAME = "username";
const ORIGINAL_PASSWORD = "password12345";

let user: User;

beforeEach(async () => {
  const hashedPassword = await SecurePassword.hash(ORIGINAL_PASSWORD);

  user = await db.user.create({
    data: {
      email: EMAIL,
      username: USERNAME,
      hashedPassword,
    },
  });
});

describe("changePasswordMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      changePasswordMutation(
        { currentPassword: ORIGINAL_PASSWORD, newPassword: "newPassword12345" },
        ctx
      )
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the password is wrong", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      changePasswordMutation(
        { currentPassword: "wrong12345", newPassword: "newPassword12345" },
        ctx
      )
    ).rejects.toThrow(AuthenticationError);
  });

  it("should succeed and hash the password, if the password is correct", async () => {
    const NEW_PASSWORD = "newPassword12345";

    const { ctx } = await createMockContext({ user });

    await expect(
      changePasswordMutation(
        { currentPassword: ORIGINAL_PASSWORD, newPassword: NEW_PASSWORD },
        ctx
      )
    ).resolves.toMatchObject({ success: true });

    const authenticatedUser = await authenticateOrError(EMAIL, NEW_PASSWORD);

    expect(authenticatedUser.email).toEqual(EMAIL);
    expect(authenticatedUser.username).toEqual(USERNAME);
  });
});
