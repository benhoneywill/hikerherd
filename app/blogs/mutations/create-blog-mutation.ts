import type { PromiseReturnType } from "blitz";

import { resolver } from "blitz";

import slugify from "app/common/helpers/slugify";

import db from "db";

import createBlogSchema from "../schemas/create-blog-schema";

const createBlogMutation = resolver.pipe(
  resolver.zod(createBlogSchema),
  resolver.authorize(),

  async ({ name }, ctx) => {
    return db.blog.create({
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
  }
);

export type CreateBlogResult = PromiseReturnType<typeof createBlogMutation>;

export default createBlogMutation;
