import type { PromiseReturnType } from "blitz";

import { NotFoundError, SecurePassword, resolver } from "blitz";

import db from "db";

import changePasswordSchema from "../schemas/change-password-schema";
import authenticateOrError from "../helpers/authenticate-or-error";

const changePasswordMutation = resolver.pipe(
  resolver.zod(changePasswordSchema),
  resolver.authorize(),

  async ({ currentPassword, newPassword }, ctx) => {
    const currentUser = await db.user.findFirst({
      where: { id: ctx.session.userId },
      select: { email: true },
    });

    if (!currentUser) throw new NotFoundError();

    const user = await authenticateOrError(currentUser.email, currentPassword);

    const hashedPassword = await SecurePassword.hash(newPassword.trim());

    await db.user.update({
      where: { id: user.id },
      data: { hashedPassword },
    });

    return { success: true };
  }
);

export type ChangePasswordResult = PromiseReturnType<
  typeof changePasswordMutation
>;

export default changePasswordMutation;
