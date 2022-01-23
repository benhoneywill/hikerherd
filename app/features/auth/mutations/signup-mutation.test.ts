import type { User } from "db";

import { ZodError } from "zod";

import createMockContext from "testing/create-mock-context";

import db from "db";

import signupMutation from "./signup-mutation";

const EMAIL = "example@example.com";
const PASSWORD = "password12345";
const USERNAME = "example";

describe("signupMutation", () => {
  it("should error if the username is invalid", async () => {
    const { ctx } = await createMockContext();

    await expect(
      signupMutation(
        {
          email: EMAIL,
          password: PASSWORD,
          username: "invalid username",
        },
        ctx
      )
    ).rejects.toThrow(ZodError);

    expect(ctx.session.userId).toEqual(null);
  });

  it("should error if the email is invalid", async () => {
    const { ctx } = await createMockContext();

    await expect(
      signupMutation(
        {
          email: "not_an_email",
          password: PASSWORD,
          username: USERNAME,
        },
        ctx
      )
    ).rejects.toThrow(ZodError);

    expect(ctx.session.userId).toEqual(null);
  });

  it("should error if the password is invalid", async () => {
    const { ctx } = await createMockContext();

    await expect(
      signupMutation(
        {
          email: EMAIL,
          password: "short",
          username: USERNAME,
        },
        ctx
      )
    ).rejects.toThrow(ZodError);

    expect(ctx.session.userId).toEqual(null);
  });

  it("should create a new user with a hashed password and create a session", async () => {
    const { ctx } = await createMockContext();

    await expect(
      signupMutation(
        {
          email: EMAIL,
          password: PASSWORD,
          username: USERNAME,
        },
        ctx
      )
    ).resolves.toMatchObject({
      email: EMAIL,
      username: USERNAME,
    });

    expect(ctx.session.userId).toBeDefined();

    const user = (await db.user.findUnique({
      where: { id: ctx.session.userId as string },
    })) as User;

    expect(user.email).toEqual(EMAIL);

    // The password should have been hashed
    expect(user.hashedPassword).not.toEqual(PASSWORD);
  });
});
