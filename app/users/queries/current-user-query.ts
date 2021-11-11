import type { Ctx } from "blitz";

import db from "db";

const currentUserQuery = async (_ = null, { session }: Ctx) => {
  if (!session.userId) return null;

  const user = await db.user.findFirst({
    where: { id: session.userId },
    select: { id: true, username: true, email: true, role: true, avatar: true },
  });

  return user;
};

export default currentUserQuery;
