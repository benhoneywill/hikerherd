import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createPack from "test/factories/create-pack";

import searchPacksQuery from "./search-packs-query";

beforeEach(async () => {
  const user = await createUser({});

  await createPack({
    name: "PCT 2022",
    userId: user.id,
  });

  await createPack({
    name: "CDT 2022",
    userId: user.id,
  });
});

describe("searchPacksQuery", () => {
  it("should return nothing if the query is empty", async () => {
    const { ctx } = await createMockContext();

    const result = await searchPacksQuery({ query: "" }, ctx);

    expect(result.length).toEqual(0);
  });

  it("should return gear that matches the query by name", async () => {
    const { ctx } = await createMockContext();

    const result1 = await searchPacksQuery({ query: "PCT" }, ctx);

    expect(result1.length).toEqual(1);
    expect(result1[0]?.name).toEqual("PCT 2022");

    const result2 = await searchPacksQuery({ query: "CDT" }, ctx);

    expect(result2.length).toEqual(1);
    expect(result2[0]?.name).toEqual("CDT 2022");

    const result3 = await searchPacksQuery({ query: "2022" }, ctx);

    expect(result3.length).toEqual(2);
    expect(result3[0]?.name).toEqual("PCT 2022");
    expect(result3[1]?.name).toEqual("CDT 2022");
  });

  it("should not return private packs", async () => {
    const { ctx } = await createMockContext();

    const user = await createUser({});

    await createPack({
      name: "private",
      private: true,
      userId: user.id,
    });

    const result = await searchPacksQuery({ query: "private" }, ctx);

    expect(result.length).toEqual(0);
  });
});
