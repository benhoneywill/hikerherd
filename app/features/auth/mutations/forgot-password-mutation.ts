import type { PromiseReturnType } from "blitz";

import { resolver } from "blitz";

import db from "db";

import sendPasswordReset from "../mailers/send-password-reset";
import forgotPasswordSchema from "../schemas/forgot-password-schema";
import generatePasswordResetToken from "../helpers/generate-password-reset-token";

const forgotPasswordMutation = resolver.pipe(
  resolver.zod(forgotPasswordSchema),

  async ({ email }) => {
    // See if a user exists for the provided email address
    const user = await db.user.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // If no user was found wait a bit so hackers can't tell the difference
      await new Promise((resolve) => setTimeout(resolve, 500));
    } else {
      // Delete any old password reset tokens
      await db.token.deleteMany({
        where: {
          type: "RESET_PASSWORD",
          userId: user.id,
        },
      });

      // Create a new password reset token
      const { token, hashedToken, expiresAt } = generatePasswordResetToken();
      await db.token.create({
        data: {
          user: { connect: { id: user.id } },
          type: "RESET_PASSWORD",
          expiresAt,
          hashedToken,
          sentTo: user.email,
        },
      });

      // Send the password reset email
      sendPasswordReset(user, { token });
    }

    // Whether or not the email was sent, return the same response
    return { success: true };
  }
);

export type ForgotPasswordResult = PromiseReturnType<
  typeof forgotPasswordMutation
>;

export default forgotPasswordMutation;
