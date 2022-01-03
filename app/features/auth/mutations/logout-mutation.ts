import type { PromiseReturnType } from "blitz";

import { resolver } from "blitz";

const logoutMutation = resolver.pipe(async (_, ctx) => {
  return await ctx.session.$revoke();
});

export type LogoutResult = PromiseReturnType<typeof logoutMutation>;

export default logoutMutation;
