import type { PromiseReturnType } from "blitz";

import { resolver } from "blitz";

import db from "db";

import createGearListSchema from "../schemas/create-gear-list-schema";

const createGearListMutation = resolver.pipe(
  resolver.zod(createGearListSchema),
  resolver.authorize(),

  async ({ name }, ctx) => {
    return db.gearList.create({
      data: {
        name,
        ownerId: ctx.session.userId,
      },
    });
  }
);

export type CreateGearListResult = PromiseReturnType<
  typeof createGearListMutation
>;

export default createGearListMutation;
