import { AuthenticationError, SecurePassword } from "blitz";

import db from "db";

import authenticateOrError from "./authenticate-or-error";

const EMAIL = "example@example.com";
const USERNAME = "username";
const PASSWORD = "password12345";

beforeEach(async () => {
  const hashedPassword = await SecurePassword.hash(PASSWORD);

  await db.user.create({
    data: {
      email: EMAIL,
      username: USERNAME,
      hashedPassword,
    },
  });
});

describe("authenticateOrError", () => {
  it("should error if the email & password are incorrect", async () => {
    await expect(
      authenticateOrError("wrong@example.com", "wrong12345")
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the email is incorrect", async () => {
    await expect(
      authenticateOrError("wrong@example.com", PASSWORD)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the password is incorrect", async () => {
    await expect(authenticateOrError(EMAIL, "wrong12345")).rejects.toThrow(
      AuthenticationError
    );
  });

  it("should return a user without the password if the credentials are correct", async () => {
    const user = await authenticateOrError(EMAIL, PASSWORD);

    expect(user.email).toEqual(EMAIL);
    expect(user.username).toEqual(USERNAME);
    expect((user as any).hashedPassword).toBeUndefined();
  });
});
