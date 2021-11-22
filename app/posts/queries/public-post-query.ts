import { NotFoundError } from "blitz";

import db from "db";

type publicPostQueryOptions = {
  slug: string;
};

const publicPostQuery = async ({ slug }: publicPostQueryOptions) => {
  const post = await db.post.findFirst({
    where: { slug },
  });

  if (!post || !post.publishedAt) {
    throw new NotFoundError();
  }

  return post;
};

export default publicPostQuery;
