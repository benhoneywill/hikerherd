import SuperJson from "superjson";

import { Prisma } from "db";

class UserCreateError extends Error {
  name = "UserCreateError";
  emailTaken = false;
  usernameTaken = false;

  constructor(error: unknown) {
    super(
      error instanceof Error ? error.message : "There was an error signing up"
    );

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const meta = error?.meta as { target?: string[] };

        if (meta?.target?.includes("email")) {
          this.emailTaken = true;
        }

        if (meta?.target?.includes("username")) {
          this.usernameTaken = true;
        }
      }
    }
  }
}

SuperJson.registerClass(UserCreateError);
SuperJson.allowErrorProps("emailTaken", "usernameTaken");

export default UserCreateError;
