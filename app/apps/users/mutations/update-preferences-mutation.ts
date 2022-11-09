import { resolver } from "blitz";

import db from "db";

import updatePreferencesSchema from "../schemas/update-preferences-schema";

const updatePreferencesMutation = resolver.pipe(
  resolver.zod(updatePreferencesSchema),
  resolver.authorize(),

  async ({ weightUnit, currency, compact }, ctx) => {
    return await db.user.update({
      where: { id: ctx.session.userId },
      data: {
        weightUnit,
        currency,
        compact,
      },
    });
  }
);

export default updatePreferencesMutation;
