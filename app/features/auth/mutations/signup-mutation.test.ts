import { ZodError } from "zod";
import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import getUserData from "test/data/get-user-data";

import db from "db";

import signupMutation from "./signup-mutation";

const { email, username, password } = getUserData();

describe("signupMutation", () => {
  it("should error if the username is invalid", async () => {
    const { ctx } = await createMockContext();

    await expect(
      signupMutation(
        {
          email,
          password,
          username: faker.lorem.words(3),
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
          email: faker.internet.userName(),
          password,
          username,
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
          email,
          password: faker.internet.password(5),
          username,
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
          email,
          password,
          username,
        },
        ctx
      )
    ).resolves.toMatchObject({
      email,
      username,
    });

    expect(ctx.session.userId).toBeDefined();

    const user = await db.user.findUnique({
      where: { id: ctx.session.userId as string },
    });

    if (!user) throw new Error("User not found");

    expect(user.email).toEqual(email);

    // The password should have been hashed
    expect(user.hashedPassword).not.toEqual(password);
  });
});
