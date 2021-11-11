import { resolver, generateToken, hash256 } from "blitz";

import { sendForgotPasswordEmail } from "app/auth/mailers/forgot-password-mailer";

import db from "db";

import { ForgotPasswordSchema } from "../schemas/forgot-password-schema";

const RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS = 4;

const forgotPasswordMutation = resolver.pipe(
  resolver.zod(ForgotPasswordSchema),

  async ({ email }) => {
    // 1. Get the user
    const user = await db.user.findFirst({ where: { email: email.toLowerCase() } });

    // 2. Generate the token and expiration date.
    const token = generateToken();
    const hashedToken = hash256(token);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS);

    // 3. If user with this email was found
    if (user) {
      // 4. Delete any existing password reset tokens
      await db.token.deleteMany({ where: { type: "RESET_PASSWORD", userId: user.id } });

      // 5. Save this new token in the database.
      await db.token.create({
        data: {
          user: { connect: { id: user.id } },
          type: "RESET_PASSWORD",
          expiresAt,
          hashedToken,
          sentTo: user.email,
        },
      });

      // 6. Send the email
      await sendForgotPasswordEmail(user, { token });
    } else {
      // 7. If no user found wait the same time so attackers can't tell the difference
      await new Promise((resolve) => setTimeout(resolve, 750));
    }

    // 8. Return the same result whether a password reset email was sent or not
    return;
  }
);

export default forgotPasswordMutation;
