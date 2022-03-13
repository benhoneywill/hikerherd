import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import updatePackSchema from "../schemas/update-pack-schema";

const updatePackMutation = resolver.pipe(
  resolver.zod(updatePackSchema),
  resolver.authorize(),

  async ({ id, name, notes, private: isPrivate }, ctx) => {
    const pack = await db.pack.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!pack) {
      throw new NotFoundError();
    }

    if (pack.userId !== ctx.session.userId) {
      throw new AuthorizationError();
    }

    return db.pack.update({
      where: { id },
      data: {
        name,
        notes: notes && JSON.stringify(notes),
        private: isPrivate,
      },
    });
  }
);

export default updatePackMutation;
