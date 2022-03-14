import { resolver } from "blitz";

import db from "db";

import changeAvatarSchema from "../schemas/change-avatar-schema";

const changeAvatarMutation = resolver.pipe(
  resolver.zod(changeAvatarSchema),
  resolver.authorize(),

  async ({ avatar }, ctx) => {
    return await db.user.update({
      where: { id: ctx.session.userId },
      data: {
        avatar,
      },
    });
  }
);

export default changeAvatarMutation;
