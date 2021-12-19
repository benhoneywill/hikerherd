import { resolver } from "blitz";

import { z } from "zod";

import db from "db";

const DeleteAll = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(DeleteAll),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const all = await db.all.deleteMany({ where: { id } });

    return all;
  }
);
