import SuperJson from "superjson";

import { Prisma } from "db";

type Messages = {
  timeout?: string;
};

class PrismaError extends Error {
  name = "PrismaError";
  message = "There was a database error";

  constructor(error: unknown, messages: Messages = {}) {
    super(
      error instanceof Error ? error.message : "There was a database error"
    );

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2028") {
        this.message = messages.timeout || "The database connection timed out";
      }
    }
  }
}

SuperJson.registerClass(PrismaError, "PrismaError");
SuperJson.allowErrorProps("message");

export default PrismaError;
