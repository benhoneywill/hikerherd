import { NotFoundError, resolver } from "blitz";

import idSchema from "app/modules/common/schemas/id-schema";

import db from "db";

const packQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(idSchema),

  async ({ id }, ctx) => {
    const pack = await db.pack.findFirst({
      where: { id, userId: ctx.session.userId },
    });

    if (!pack) {
      throw new NotFoundError();
    }

    return pack;
  }
);

export default packQuery;
