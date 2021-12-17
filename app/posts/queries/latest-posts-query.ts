import type { PromiseReturnType } from "blitz";

import { paginate, resolver } from "blitz";

import paginationSchema from "app/common/schemas/pagination-schema";

import db from "db";

const latestPostsQuery = resolver.pipe(
  resolver.zod(paginationSchema),

  async ({ skip, take }) => {
    const result = await paginate({
      skip,
      take,
      count: () => db.post.count(),
      query: async (paginateArgs) => {
        const posts = await db.post.findMany({
          ...paginateArgs,
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: {
                username: true,
                avatar: true,
              },
            },
          },
        });

        return Promise.all(
          posts.map(async (post) => ({
            ...post,
            commentCount: await db.comment.count({
              where: { rootId: post.id, rootType: "POST" },
            }),
          }))
        );
      },
    });

    return result;
  }
);

export type LatestPostsResult = PromiseReturnType<typeof latestPostsQuery>;
export type LatestPostsResultItem = LatestPostsResult["items"][number];

export default latestPostsQuery;
