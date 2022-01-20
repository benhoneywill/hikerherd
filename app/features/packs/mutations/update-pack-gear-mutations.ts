import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import updatePackGearSchema from "../schemas/update-pack-gear-schema";

const updatePackGearMutation = resolver.pipe(
  resolver.zod(updatePackGearSchema),
  resolver.authorize(),

  async ({ id, ...values }, ctx) => {
    const packItem = await db.packCategoryItem.findFirst({
      where: { id, category: { pack: { userId: ctx.session.userId } } },
    });

    if (!packItem) {
      throw new NotFoundError();
    }

    await db.packCategoryItem.update({
      where: { id },
      data: {
        worn: values.worn,
        gear: {
          update: {
            name: values.name,
            weight: values.weight,
            imageUrl: values.imageUrl,
            link: values.link,
            notes: values.notes,
            consumable: values.consumable,
            price: values.price,
            currency: values.currency,
          },
        },
      },
    });
  }
);

export type UpdatePackGearResult = PromiseReturnType<
  typeof updatePackGearMutation
>;

export default updatePackGearMutation;
