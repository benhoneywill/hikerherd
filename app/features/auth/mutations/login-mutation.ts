import { resolver } from "blitz";

import loginSchema from "../schemas/login-schema";
import authenticateOrError from "../helpers/authenticate-or-error";

export const loginMutation = resolver.pipe(
  resolver.zod(loginSchema),

  async ({ email, password }, ctx) => {
    const user = await authenticateOrError(email, password);
    await ctx.session.$create({ userId: user.id, role: user.role });
    return user;
  }
);

export default loginMutation;
