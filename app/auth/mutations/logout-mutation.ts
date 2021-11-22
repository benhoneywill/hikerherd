import type { Ctx, PromiseReturnType } from "blitz";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logoutMutation = async (_: any, ctx: Ctx) => {
  return await ctx.session.$revoke();
};

export type LogoutResult = PromiseReturnType<typeof logoutMutation>;

export default logoutMutation;
