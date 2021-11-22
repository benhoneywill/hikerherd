import type { Ctx } from "blitz";

import { hash256 } from "blitz";

import db from "db";

import passwordMailer from "../mailers/password-mailer";

import forgotPasswordMutation from "./forgot-password-mutation";

const generatedToken = "plain-token";

const sendPasswordReset = jest.spyOn(passwordMailer, "sendPasswordReset");

jest.mock("blitz", () => ({
  ...jest.requireActual<Record<string, unknown>>("blitz"),
  generateToken: () => generatedToken,
}));

beforeEach(() => {
  sendPasswordReset.mockReset();
});

describe("forgotPassword mutation", () => {
  it("does not throw error if user doesn't exist", async () => {
    await expect(
      forgotPasswordMutation({ email: "no-user@email.com" }, {} as Ctx)
    ).resolves.not.toThrow();
  });

  it("works correctly", async () => {
    // Create test user
    const user = await db.user.create({
      data: {
        email: "user@example.com",
        username: "example_username",
        tokens: {
          // Create old token to ensure it's deleted
          create: {
            type: "RESET_PASSWORD",
            hashedToken: "token",
            expiresAt: new Date(),
            sentTo: "user@example.com",
          },
        },
      },
      include: { tokens: true },
    });

    // Invoke the mutation
    await forgotPasswordMutation({ email: user.email }, {} as Ctx);

    const tokens = await db.token.findMany({ where: { userId: user.id } });
    const token = tokens[0];
    if (!user.tokens[0]) throw new Error("Missing user token");
    if (!token) throw new Error("Missing token");

    // delete's existing tokens
    expect(tokens.length).toBe(1);

    expect(token.id).not.toBe(user.tokens[0].id);
    expect(token.type).toBe("RESET_PASSWORD");
    expect(token.sentTo).toBe(user.email);
    expect(token.hashedToken).toBe(hash256(generatedToken));
    expect(token.expiresAt > new Date()).toBe(true);
    expect(sendPasswordReset).toBeCalledTimes(1);
  });
});
