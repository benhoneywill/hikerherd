import { resolver } from "blitz";

import { LoginSchema } from "../schemas/login-schema";
import { authenticateUser } from "../helpers/authenticate-user";

export const loginMutation = resolver.pipe(
  resolver.zod(LoginSchema),

  async ({ email, password }, ctx) => {
    // This throws an error if credentials are invalid
    const user = await authenticateUser(email, password);
    await ctx.session.$create({ userId: user.id, role: user.role });
    return user;
  }
);

export default loginMutation;
