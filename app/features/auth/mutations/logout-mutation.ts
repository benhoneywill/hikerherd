import { resolver } from "blitz";

const logoutMutation = resolver.pipe(async (_, ctx) => {
  return await ctx.session.$revoke();
});

export default logoutMutation;
