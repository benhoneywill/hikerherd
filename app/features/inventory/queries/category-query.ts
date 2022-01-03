import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import getCategorySchema from "../schemas/get-category-schema";

const categoryQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(getCategorySchema),

  async ({ id }, ctx) => {
    const category = await db.category.findFirst({
      where: { userId: ctx.session.userId, id },
    });

    if (!category) throw new NotFoundError();

    return category;
  }
);

export type CategoryResult = PromiseReturnType<typeof categoryQuery>;

export default categoryQuery;
