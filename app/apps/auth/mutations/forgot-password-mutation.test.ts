import type { User } from "db";

import { hash256 } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";

import db from "db";

import * as sendPasswordResetMailer from "../mailers/send-password-reset";

import forgotPasswordMutation from "./forgot-password-mutation";

const generatedToken = "a1b2c3d4e5";

const sendPasswordReset = jest.spyOn(sendPasswordResetMailer, "default");

jest.mock("blitz", () => ({
  ...jest.requireActual<Record<string, unknown>>("blitz"),
  generateToken: () => generatedToken,
}));

let user: User;

beforeEach(async () => {
  sendPasswordReset.mockReset();
  user = await createUser();
});

describe("forgotPasswordMutation", () => {
  it("does not throw error if user doesn't exist", async () => {
    const { ctx } = await createMockContext();

    await expect(
      forgotPasswordMutation({ email: faker.internet.email() }, ctx)
    ).resolves.not.toThrow();
  });

  it("works correctly", async () => {
    const oldToken = await db.token.create({
      data: {
        type: "RESET_PASSWORD",
        hashedToken: faker.random.alphaNumeric(),
        expiresAt: new Date(),
        sentTo: user.email,
        userId: user.id,
      },
    });

    const { ctx } = await createMockContext();
    await forgotPasswordMutation({ email: user.email }, ctx);

    const tokens = await db.token.findMany({ where: { userId: user.id } });
    const token = tokens[0];

    if (!token) fail("Missing token");

    // deletes the old token
    expect(tokens.length).toBe(1);

    expect(token.id).not.toBe(oldToken.id);
    expect(token.type).toBe("RESET_PASSWORD");
    expect(token.sentTo).toBe(user.email);
    expect(token.hashedToken).toBe(hash256(generatedToken));
    expect(token.expiresAt > new Date()).toBe(true);
    expect(sendPasswordReset).toBeCalledTimes(1);
  });
});
