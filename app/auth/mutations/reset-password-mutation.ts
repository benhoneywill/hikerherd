import type { PromiseReturnType } from "blitz";

import { resolver, SecurePassword, hash256 } from "blitz";

import db, { TokenType } from "db";

import ResetPasswordError from "../errors/reset-password-error";
import resetPasswordSchema from "../schemas/reset-password-schema";

import { loginMutation } from "./login-mutation";

const resetPasswordMutation = resolver.pipe(
  resolver.zod(resetPasswordSchema),

  async ({ password, token }, ctx) => {
    // Try to find this token in the database
    const hashedToken = hash256(token);
    const matchedToken = await db.token.findFirst({
      where: { hashedToken, type: TokenType.RESET_PASSWORD },
      include: { user: true },
    });

    // If token not found, error
    if (!matchedToken) {
      throw new ResetPasswordError();
    }

    // Delete token so it can't be used again
    await db.token.delete({ where: { id: matchedToken.id } });

    // If token has expired, error
    if (matchedToken.expiresAt < new Date()) {
      throw new ResetPasswordError();
    }

    // Token is valid, now we can update the user's password
    const hashedPassword = await SecurePassword.hash(password.trim());
    const user = await db.user.update({
      where: { id: matchedToken.userId },
      data: { hashedPassword },
    });

    // Revoke all existing sessions for this user
    await db.session.deleteMany({ where: { userId: user.id } });

    // Log the user in with the new credentials
    await loginMutation({ email: user.email, password }, ctx);

    return { success: true };
  }
);

export type ResetPasswordResult = PromiseReturnType<typeof resetPasswordMutation>;

export default resetPasswordMutation;
