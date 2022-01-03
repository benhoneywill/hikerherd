import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import getCategoryItemSchema from "../schemas/get-category-item-schema";

const categoryItemQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(getCategoryItemSchema),

  async ({ id }, ctx) => {
    const item = await db.categoryItem.findFirst({
      where: { id, category: { userId: ctx.session.userId } },
      include: { gear: true },
    });

    if (!item) throw new NotFoundError();

    return item;
  }
);

export type CategoryItemResult = PromiseReturnType<typeof categoryItemQuery>;

export default categoryItemQuery;
