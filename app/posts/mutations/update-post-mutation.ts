import { NotFoundError, resolver } from "blitz";

import db from "db";

import { UpdatePostSchema } from "../schemas/update-post-schema";

const updatePostMutation = resolver.pipe(
  resolver.zod(UpdatePostSchema),
  resolver.authorize(),

  async ({ id, title, content, publish }, ctx) => {
    const post = await db.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundError();
    }

    const published = publish && !post.publishedAt ? { publishedAt: new Date() } : {};

    return db.post.update({
      where: { id },
      data: {
        title,
        content: JSON.stringify(content),
        ...published,
      },
    });
  }
);

export default updatePostMutation;
