import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";

import userCountQuery from "./user-count-query";

describe("userCountQuery", () => {
  it("should return the number of users", async () => {
    const { ctx } = await createMockContext();

    const result1 = await userCountQuery({}, ctx);
    expect(result1).toEqual(0);

    await createUser({});

    const result2 = await userCountQuery({}, ctx);
    expect(result2).toEqual(1);

    await createUser({});
    await createUser({});
    await createUser({});

    const result3 = await userCountQuery({}, ctx);
    expect(result3).toEqual(4);
  });
});
