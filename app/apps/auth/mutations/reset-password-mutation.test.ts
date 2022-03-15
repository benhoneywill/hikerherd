import type { User } from "db";

import { hash256, SecurePassword } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";

import db from "db";

import ResetPasswordError from "../errors/reset-password-error";

import resetPasswordMutation from "./reset-password-mutation";

let user: User;

beforeEach(async () => {
  user = await createUser({});
});

describe("resetPasswordMutation", () => {
  it("should fail when the provided token does not exist", async () => {
    const { ctx: mockContext } = await createMockContext();

    const newPassword = faker.internet.password();

    await expect(
      resetPasswordMutation(
        {
          token: faker.random.alphaNumeric(),
          password: newPassword,
          passwordConfirmation: newPassword,
        },
        mockContext
      )
    ).rejects.toThrow(ResetPasswordError);
  });

  it("should fail when the provided token is expired", async () => {
    const { ctx: mockContext } = await createMockContext();

    const expiredToken = faker.random.alphaNumeric();

    await db.token.create({
      data: {
        type: "RESET_PASSWORD",
        hashedToken: hash256(expiredToken),
        expiresAt: new Date(Date.now() - 3600000),
        sentTo: user.email,
        userId: user.id,
      },
    });

    const newPassword = faker.internet.password();

    await expect(
      resetPasswordMutation(
        {
          token: expiredToken,
          password: newPassword,
          passwordConfirmation: newPassword,
        },
        mockContext
      )
    ).rejects.toThrow(ResetPasswordError);

    const numberOfTokens = await db.token.count({ where: { userId: user.id } });
    expect(numberOfTokens).toBe(0);
  });

  it("Should correctly update the user's password with a valid token", async () => {
    const { ctx: mockContext } = await createMockContext();

    const goodToken = faker.random.alphaNumeric();

    await db.token.create({
      data: {
        type: "RESET_PASSWORD",
        hashedToken: hash256(goodToken),
        expiresAt: new Date(Date.now() + 3600000),
        sentTo: user.email,
        userId: user.id,
      },
    });

    const newPassword = faker.internet.password();

    await resetPasswordMutation(
      {
        token: goodToken,
        password: newPassword,
        passwordConfirmation: newPassword,
      },
      mockContext
    );

    const numberOfTokens = await db.token.count({ where: { userId: user.id } });
    expect(numberOfTokens).toBe(0);

    const updatedUser = await db.user.findFirst({ where: { id: user.id } });

    expect(
      await SecurePassword.verify(updatedUser?.hashedPassword, newPassword)
    ).toBe(SecurePassword.VALID);
  });
});
