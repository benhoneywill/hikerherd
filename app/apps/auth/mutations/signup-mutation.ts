import { resolver, SecurePassword } from "blitz";

import db from "db";

import signupSchema from "../schemas/signup-schema";
import UserCreateError from "../errors/user-create-error";

const signupMutation = resolver.pipe(
  resolver.zod(signupSchema),

  async ({ email, password, username }, ctx) => {
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedUsername = username.toLowerCase().trim();
    const hashedPassword = await SecurePassword.hash(password.trim());

    try {
      const user = await db.user.create({
        select: { id: true, username: true, email: true, role: true },
        data: {
          email: sanitizedEmail,
          username: sanitizedUsername,
          hashedPassword,
        },
      });

      await ctx.session.$create({ userId: user.id, role: user.role });

      return user;
    } catch (error) {
      throw new UserCreateError(error);
    }
  }
);

export default signupMutation;
