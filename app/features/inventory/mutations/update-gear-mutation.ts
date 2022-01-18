import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import updateGearSchema from "../schemas/update-gear-schema";

const updateGearMutation = resolver.pipe(
  resolver.zod(updateGearSchema),
  resolver.authorize(),

  async ({ id, ...values }, ctx) => {
    const gear = await db.gear.findFirst({
      where: { id, userId: ctx.session.userId },
    });

    if (!gear) {
      throw new NotFoundError();
    }

    return db.gear.update({
      where: { id },
      data: {
        name: values.name,
        weight: values.weight,
        imageUrl: values.imageUrl,
        link: values.link,
        consumable: values.consumable,
        notes: values.notes,
        price: values.price,
        type: values.type,
        currency: values.currency,
      },
    });
  }
);

export type UpdateGearResult = PromiseReturnType<typeof updateGearMutation>;

export default updateGearMutation;
