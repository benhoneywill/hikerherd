import type { User } from "db";

import { AuthenticationError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";

import db from "db";

import changeAvatarMutation from "./change-avatar-mutation";

let user: User;

beforeEach(async () => {
  user = await createUser({});
});

describe("changeAvatarMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      changeAvatarMutation({ publicId: faker.random.word(), version: 1 }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should update the avatar", async () => {
    const { ctx } = await createMockContext({ user });

    const newAvatar = faker.random.word();

    await changeAvatarMutation({ publicId: newAvatar, version: 1 }, ctx);

    const fetched = await db.user.findUnique({
      where: { id: user.id },
    });

    expect(fetched?.avatar_id).toEqual(newAvatar);
    expect(fetched?.avatar_version).toEqual(1);
  });
});
