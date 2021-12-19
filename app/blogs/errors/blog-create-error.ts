import SuperJson from "superjson";

import { Prisma } from "db";

class BlogCreateError extends Error {
  name = "BlogCreateError";
  nameTaken = false;

  constructor(error: unknown) {
    super(
      error instanceof Error ? error.message : "There was an creating the blog"
    );

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const meta = error?.meta as { target?: string[] };

        if (meta?.target?.includes("name") || meta?.target?.includes("slug")) {
          this.nameTaken = true;
        }
      }
    }
  }
}

SuperJson.registerClass(BlogCreateError);
SuperJson.allowErrorProps("nameTaken");

export default BlogCreateError;
