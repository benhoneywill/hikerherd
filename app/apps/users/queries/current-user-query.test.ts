import type { User } from "db";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";

import currentUserQuery from "./current-user-query";

let user: User;

beforeEach(async () => {
  user = await createUser();
});

describe("currentUserQuery", () => {
  it("should return null if not logged in", async () => {
    const { ctx } = await createMockContext();

    const result = await currentUserQuery({}, ctx);

    expect(result).toEqual(null);
  });

  it("should fetch the current user", async () => {
    const { ctx } = await createMockContext({ user });

    const fetched = await currentUserQuery({}, ctx);

    expect(fetched?.id).toEqual(user.id);
    expect(fetched?.username).toEqual(user.username);
    expect(fetched?.email).toEqual(user.email);
    expect(fetched?.role).toEqual(user.role);
    expect(fetched?.avatar).toEqual(user.avatar);
    expect(fetched?.weightUnit).toEqual(user.weightUnit);
    expect(fetched?.currency).toEqual(user.currency);
  });
});
