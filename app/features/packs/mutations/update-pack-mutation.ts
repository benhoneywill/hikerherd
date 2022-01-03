import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import updatePackSchema from "../schemas/update-pack-schema";

const updatePackMutation = resolver.pipe(
  resolver.zod(updatePackSchema),
  resolver.authorize(),

  async ({ id, name, notes }, ctx) => {
    const pack = await db.pack.findFirst({
      where: { id, userId: ctx.session.userId },
    });

    if (!pack) {
      throw new NotFoundError();
    }

    return db.pack.update({
      where: { id },
      data: {
        name,
        notes: notes && JSON.stringify(notes),
      },
    });
  }
);

export type UpdatePackResult = PromiseReturnType<typeof updatePackMutation>;

export default updatePackMutation;
