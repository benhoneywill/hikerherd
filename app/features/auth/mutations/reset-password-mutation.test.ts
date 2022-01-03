import { hash256, SecurePassword } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import ResetPasswordError from "../errors/reset-password-error";

import resetPasswordMutation from "./reset-password-mutation";

beforeEach(async () => {
  await db.$reset();
});

describe("resetPasswordMutation", () => {
  it("works correctly", async () => {
    // Create test user
    const goodToken = "randomPasswordResetToken";
    const expiredToken = "expiredRandomPasswordResetToken";
    const future = new Date();
    future.setHours(future.getHours() + 4);
    const past = new Date();
    past.setHours(past.getHours() - 4);

    const user = await db.user.create({
      data: {
        email: "user@example.com",
        username: "example_username",
        tokens: {
          // Create old token to ensure it's deleted
          create: [
            {
              type: "RESET_PASSWORD",
              hashedToken: hash256(expiredToken),
              expiresAt: past,
              sentTo: "user@example.com",
            },
            {
              type: "RESET_PASSWORD",
              hashedToken: hash256(goodToken),
              expiresAt: future,
              sentTo: "user@example.com",
            },
          ],
        },
      },
      include: { tokens: true },
    });

    const { ctx: mockContext } = await createMockContext();

    const newPassword = "newPassword12345";

    // Non-existent token
    await expect(
      resetPasswordMutation(
        {
          token: "no-token",
          password: newPassword,
          passwordConfirmation: newPassword,
        },
        mockContext
      )
    ).rejects.toThrow(ResetPasswordError);

    // Expired token
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

    // Good token
    await resetPasswordMutation(
      {
        token: goodToken,
        password: newPassword,
        passwordConfirmation: newPassword,
      },
      mockContext
    );

    // Delete's the token
    const numberOfTokens = await db.token.count({ where: { userId: user.id } });
    expect(numberOfTokens).toBe(0);

    // Updates user's password
    const updatedUser = await db.user.findFirst({ where: { id: user.id } });
    expect(
      await SecurePassword.verify(updatedUser?.hashedPassword, newPassword)
    ).toBe(SecurePassword.VALID);
  });
});
