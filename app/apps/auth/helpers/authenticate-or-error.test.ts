import type { User } from "db";

import { AuthenticationError } from "blitz";

import { faker } from "@faker-js/faker";

import createUser from "test/factories/create-user";

import authenticateOrError from "./authenticate-or-error";

let user: User;
const password = faker.internet.password(12);

beforeEach(async () => {
  user = await createUser({ password });
});

describe("authenticateOrError", () => {
  it("should error if the email & password are incorrect", async () => {
    await expect(
      authenticateOrError(faker.internet.email(), faker.internet.password())
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the email is incorrect", async () => {
    await expect(
      authenticateOrError(faker.internet.email(), password)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the password is incorrect", async () => {
    await expect(
      authenticateOrError(user.email, faker.internet.password())
    ).rejects.toThrow(AuthenticationError);
  });

  it("should return a user without the password if the credentials are correct", async () => {
    const authenticatedUser = await authenticateOrError(user.email, password);

    expect(authenticatedUser.email).toEqual(user.email);
    expect(authenticatedUser.username).toEqual(user.username);
    expect((authenticatedUser as User).hashedPassword).toBeUndefined();
  });
});
