import { resolver } from "blitz";

import db from "db";

const packsQuery = resolver.pipe(
  resolver.authorize(),

  async (values, ctx) => {
    return db.pack.findMany({
      where: { userId: ctx.session.userId },
    });
  }
);

export default packsQuery;