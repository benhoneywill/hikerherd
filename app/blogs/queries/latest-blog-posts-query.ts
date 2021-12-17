import type { PromiseReturnType } from "blitz";

import { paginate, resolver } from "blitz";

import paginationSchema from "app/common/schemas/pagination-schema";

import db from "db";

const latestBlogPostsQuery = resolver.pipe(
  resolver.zod(paginationSchema),

  async ({ skip, take }) => {
    const where = { publishedAt: { not: null } };

    const result = await paginate({
      skip,
      take,
      count: () => db.blogPost.count({ where }),
      query: async (paginateArgs) => {
        const blogPosts = await db.blogPost.findMany({
          ...paginateArgs,
          where,
          orderBy: { publishedAt: "desc" },
          include: {
            blog: {
              select: {
                name: true,
                slug: true,
              },
            },
            author: {
              select: {
                username: true,
                avatar: true,
              },
            },
          },
        });

        return Promise.all(
          blogPosts.map(async (blogPost) => ({
            ...blogPost,
            commentCount: await db.comment.count({
              where: { rootId: blogPost.id, rootType: "BLOG_POST" },
            }),
          }))
        );
      },
    });

    return result;
  }
);

export type LatestBlogPostsResult = PromiseReturnType<
  typeof latestBlogPostsQuery
>;
export type LatestBlogPostsResultItem = LatestBlogPostsResult["items"][number];

export default latestBlogPostsQuery;
