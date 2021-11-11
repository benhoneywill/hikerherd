import type { Ctx } from "blitz";

const logoutMutation = async (_: any, ctx: Ctx) => {
  return await ctx.session.$revoke();
};

export default logoutMutation;
