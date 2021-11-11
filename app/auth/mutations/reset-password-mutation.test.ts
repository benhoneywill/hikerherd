import { hash256, SecurePassword } from "blitz";

import db from "db";

import resetPasswordMutation from "./reset-password-mutation";

beforeEach(async () => {
  await db.$reset();
});

const mockCtx: any = {
  session: {
    $create: jest.fn,
  },
};

describe("resetPassword mutation", () => {
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

    const newPassword = "newPassword";

    // Non-existent token
    await expect(
      resetPasswordMutation({ token: "no-token", password: "", passwordConfirmation: "" }, mockCtx)
    ).rejects.toThrowError();

    // Expired token
    await expect(
      resetPasswordMutation(
        { token: expiredToken, password: newPassword, passwordConfirmation: newPassword },
        mockCtx
      )
    ).rejects.toThrowError();

    // Good token
    await resetPasswordMutation(
      { token: goodToken, password: newPassword, passwordConfirmation: newPassword },
      mockCtx
    );

    // Delete's the token
    const numberOfTokens = await db.token.count({ where: { userId: user.id } });
    expect(numberOfTokens).toBe(0);

    // Updates user's password
    const updatedUser = await db.user.findFirst({ where: { id: user.id } });
    expect(await SecurePassword.verify(updatedUser!.hashedPassword, newPassword)).toBe(
      SecurePassword.VALID
    );
  });
});
