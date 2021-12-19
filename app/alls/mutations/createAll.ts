import { resolver } from "blitz";

import { z } from "zod";

import db from "db";

const CreateAll = z.object({
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(CreateAll),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const all = await db.all.create({ data: input });

    return all;
  }
);
