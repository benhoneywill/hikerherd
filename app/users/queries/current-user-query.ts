import type { Ctx } from "blitz";

import db from "db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const currentUserQuery = async (_: any, ctx: Ctx) => {
  if (!ctx.session.userId) return null;

  const user = await db.user.findFirst({
    where: { id: ctx.session.userId },
    select: { id: true, username: true, email: true, role: true, avatar: true },
  });

  return user;
};

export default currentUserQuery;
