import { resolver } from "blitz";

import slugify from "app/modules/common/helpers/slugify";

import db from "db";

import createPackSchema from "../schemas/create-pack-schema";

const createPackMutation = resolver.pipe(
  resolver.zod(createPackSchema),
  resolver.authorize(),

  async ({ name, notes }, ctx) => {
    return db.pack.create({
      data: {
        name,
        notes: notes && JSON.stringify(notes),
        slug: slugify(name, { withRandomSuffix: true }),
        userId: ctx.session.userId,
      },
    });
  }
);

export default createPackMutation;
