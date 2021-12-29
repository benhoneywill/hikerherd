import type { PromiseReturnType } from "blitz";

import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import updateGearListSchema from "../schemas/update-gear-list-schema";

const updateGearListMutation = resolver.pipe(
  resolver.zod(updateGearListSchema),
  resolver.authorize(),

  async ({ id, name }, ctx) => {
    const list = await db.gearList.findFirst({ where: { id } });

    if (!list) {
      throw new NotFoundError();
    }

    if (list.ownerId !== ctx.session.userId) {
      throw new AuthorizationError();
    }

    return db.gearList.update({
      where: { id },
      data: {
        name,
      },
    });
  }
);

export type UpdateGearListResult = PromiseReturnType<
  typeof updateGearListMutation
>;

export default updateGearListMutation;
