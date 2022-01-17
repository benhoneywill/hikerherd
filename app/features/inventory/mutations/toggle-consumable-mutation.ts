import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import toggleConsumableSchema from "../schemas/toggle-consumable-schema";

const toggleConsumableMutation = resolver.pipe(
  resolver.zod(toggleConsumableSchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    const item = await db.categoryItem.findFirst({
      where: { id, category: { userId: ctx.session.userId } },
      include: { gear: true },
    });

    if (!item) {
      throw new NotFoundError();
    }

    return db.categoryItem.update({
      where: { id },
      data: { gear: { update: { consumable: !item.gear.consumable } } },
    });
  }
);

export type ToggleConsumableResult = PromiseReturnType<
  typeof toggleConsumableMutation
>;

export default toggleConsumableMutation;
