import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import updatePostSchema from "../schemas/update-post-schema";

const updatePostMutation = resolver.pipe(
  resolver.zod(updatePostSchema),
  resolver.authorize(),

  async ({ id, title, content }) => {
    const post = await db.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundError();
    }

    return db.post.update({
      where: { id },
      data: {
        title,
        content: JSON.stringify(content),
      },
    });
  }
);

export type UpdatePostResult = PromiseReturnType<typeof updatePostMutation>;

export default updatePostMutation;
