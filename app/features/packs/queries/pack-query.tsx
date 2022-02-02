import { AuthorizationError, NotFoundError, resolver } from "blitz";

import idSchema from "app/modules/common/schemas/id-schema";

import db from "db";

const packQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(idSchema),

  async ({ id }, ctx) => {
    const pack = await db.pack.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        notes: true,
        name: true,
      },
    });

    if (!pack) {
      throw new NotFoundError();
    }

    if (pack.userId !== ctx.session.userId) {
      throw new AuthorizationError();
    }

    return pack;
  }
);

export default packQuery;
