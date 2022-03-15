import type { User } from "db";

import { AuthenticationError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";

import authenticateOrError from "../helpers/authenticate-or-error";

import changePasswordMutation from "./change-password-mutation";

let user: User;
const originalPassword = faker.internet.password(12);

beforeEach(async () => {
  user = await createUser({ password: originalPassword });
});

describe("changePasswordMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      changePasswordMutation(
        {
          currentPassword: originalPassword,
          newPassword: faker.internet.password(12),
        },
        ctx
      )
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the password is wrong", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      changePasswordMutation(
        {
          currentPassword: faker.internet.password(12),
          newPassword: faker.internet.password(12),
        },
        ctx
      )
    ).rejects.toThrow(AuthenticationError);
  });

  it("should succeed and hash the password, if the password is correct", async () => {
    const NEW_PASSWORD = faker.internet.password(12);

    const { ctx } = await createMockContext({ user });

    await expect(
      changePasswordMutation(
        { currentPassword: originalPassword, newPassword: NEW_PASSWORD },
        ctx
      )
    ).resolves.toMatchObject({ success: true });

    const authenticatedUser = await authenticateOrError(
      user.email,
      NEW_PASSWORD
    );

    expect(authenticatedUser.email).toEqual(user.email);
    expect(authenticatedUser.username).toEqual(user.username);
  });
});
