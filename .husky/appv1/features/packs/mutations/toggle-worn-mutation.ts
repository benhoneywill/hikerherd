import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import toggleWornSchema from "../schemas/toggle-worn-schema";

const toggleWornMutation = resolver.pipe(
  resolver.zod(toggleWornSchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    const item = await db.packCategoryItem.findFirst({
      where: { id, category: { pack: { userId: ctx.session.userId } } },
    });

    if (!item) {
      throw new NotFoundError();
    }

    return db.packCategoryItem.update({
      where: { id },
      data: { worn: !item.worn },
    });
  }
);

export type ToggleWornResult = PromiseReturnType<typeof toggleWornMutation>;

export default toggleWornMutation;
