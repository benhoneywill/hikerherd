import type { User } from "db";

import { AuthenticationError } from "blitz";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";

import db from "db";

import updatePreferencesMutation from "./update-preferences-mutation";

let user: User;

beforeEach(async () => {
  user = await createUser();
});

describe("updatePreferencesMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      updatePreferencesMutation(
        { weightUnit: "IMPERIAL", currency: "EUR" },
        ctx
      )
    ).rejects.toThrow(AuthenticationError);
  });

  it("should update the preferences", async () => {
    const { ctx } = await createMockContext({ user });

    await updatePreferencesMutation(
      { weightUnit: "IMPERIAL", currency: "EUR" },
      ctx
    );

    const fetched = await db.user.findUnique({
      where: { id: user.id },
    });

    expect(fetched?.weightUnit).toEqual("IMPERIAL");
    expect(fetched?.currency).toEqual("EUR");
  });
});
