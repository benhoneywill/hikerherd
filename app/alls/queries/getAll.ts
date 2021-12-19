import { resolver, NotFoundError } from "blitz";

import { z } from "zod";

import db from "db";

const GetAll = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
});

export default resolver.pipe(
  resolver.zod(GetAll),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const all = await db.all.findFirst({ where: { id } });

    if (!all) throw new NotFoundError();

    return all;
  }
);
