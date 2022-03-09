import type { User } from "db";

import faker from "@faker-js/faker";

import createUser from "test/helpers/create-user";

import db from "db";

import UserCreateError from "./user-create-error";

let user: User;

beforeEach(async () => {
  user = await createUser();
});

describe("UserCreateError", () => {
  it("should correctly set usernameTaken", async () => {
    try {
      await db.user.create({
        data: {
          email: faker.internet.email(),
          username: user.username,
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
          email: user.email,
          username: faker.internet.userName(),
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
