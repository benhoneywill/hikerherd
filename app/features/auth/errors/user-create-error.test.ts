import db from "db";

import UserCreateError from "./user-create-error";

const TAKEN_EMAIL = "taken@example.com";
const TAKEN_USERNAME = "taken";

beforeEach(async () => {
  await db.user.create({
    data: {
      email: TAKEN_EMAIL,
      username: TAKEN_USERNAME,
    },
  });
});

describe("UserCreateError", () => {
  it("should correctly set usernameTaken", async () => {
    try {
      await db.user.create({
        data: {
          email: "unique@example.com",
          username: TAKEN_USERNAME,
        },
      });

      fail("Should error");
    } catch (error) {
      const userCreateError = new UserCreateError(error);
      expect(userCreateError.usernameTaken).toBe(true);
      expect(userCreateError.emailTaken).toBe(false);
    }
  });

  it("should correctly set emailTaken", async () => {
    try {
      await db.user.create({
        data: {
          email: TAKEN_EMAIL,
          username: "unique",
        },
      });

      fail("Should error");
    } catch (error) {
      const userCreateError = new UserCreateError(error);
      expect(userCreateError.usernameTaken).toBe(false);
      expect(userCreateError.emailTaken).toBe(true);
    }
  });
});
