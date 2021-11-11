import { resolver, SecurePassword } from "blitz";

import { SignupSchema } from "app/auth/schemas/signup-schema";

import db from "db";

const signupMutation = resolver.pipe(
  resolver.zod(SignupSchema),

  async ({ email, password, username }, ctx) => {
    const hashedPassword = await SecurePassword.hash(password.trim());

    const user = await db.user.create({
      data: {
        email: email.toLowerCase().trim(),
        username: username.toLowerCase().trim(),
        hashedPassword,
        role: "USER",
      },
      select: { id: true, username: true, email: true, role: true },
    });

    await ctx.session.$create({ userId: user.id, role: user.role });
    return user;
  }
);

export default signupMutation;
