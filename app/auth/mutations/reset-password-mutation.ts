import { resolver, SecurePassword, hash256 } from "blitz";

import db from "db";

import { ResetPasswordSchema } from "../schemas/reset-password-schema";

import { loginMutation } from "./login-mutation";

class ResetPasswordError extends Error {
  name = "ResetPasswordError";
  message = "Reset password link is invalid or it has expired.";
}

const resetPasswordMutation = resolver.pipe(
  resolver.zod(ResetPasswordSchema),

  async ({ password, token }, ctx) => {
    // 1. Try to find this token in the database
    const hashedToken = hash256(token);
    const matchedToken = await db.token.findFirst({
      where: { hashedToken, type: "RESET_PASSWORD" },
      include: { user: true },
    });

    // 2. If token not found, error
    if (!matchedToken) {
      throw new ResetPasswordError();
    }

    // 3. Delete token so it can't be used again
    await db.token.delete({ where: { id: matchedToken.id } });

    // 4. If token has expired, error
    if (matchedToken.expiresAt < new Date()) {
      throw new ResetPasswordError();
    }

    // 5. Since token is valid, now we can update the user's password
    const hashedPassword = await SecurePassword.hash(password.trim());
    const user = await db.user.update({
      where: { id: matchedToken.userId },
      data: { hashedPassword },
    });

    // 6. Revoke all existing login sessions for this user
    await db.session.deleteMany({ where: { userId: user.id } });

    // 7. Now log the user in with the new credentials
    await loginMutation({ email: user.email, password }, ctx);

    return true;
  }
);

export default resetPasswordMutation;
