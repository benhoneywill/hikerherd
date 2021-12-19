import { resolver } from "blitz";

import { z } from "zod";

import db from "db";

const UpdateAll = z.object({
  id: z.number(),
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(UpdateAll),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const all = await db.all.update({ where: { id }, data });

    return all;
  }
);
