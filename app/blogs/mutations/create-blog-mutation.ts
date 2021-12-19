import type { PromiseReturnType } from "blitz";

import { resolver } from "blitz";

import slugify from "app/common/helpers/slugify";

import db from "db";

import createBlogSchema from "../schemas/create-blog-schema";
import BlogCreateError from "../errors/blog-create-error";

const createBlogMutation = resolver.pipe(
  resolver.zod(createBlogSchema),
  resolver.authorize(),

  async ({ name }, ctx) => {
    try {
      return await db.blog.create({
        data: {
          name,
          slug: slugify(name),
          users: {
            create: {
              userId: ctx.session.userId,
              role: "ADMIN",
            },
          },
        },
      });
    } catch (error) {
      throw new BlogCreateError(error);
    }
  }
);

export type CreateBlogResult = PromiseReturnType<typeof createBlogMutation>;

export default createBlogMutation;
