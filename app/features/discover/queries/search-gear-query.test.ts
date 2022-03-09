import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";
import createGear from "test/helpers/create-gear";

import searchGearQuery from "./search-gear-query";

beforeEach(async () => {
  const user = await createUser();

  await createGear({
    name: "Tent",
    notes: "This tent shelters me",
    userId: user.id,
  });

  await createGear({
    name: "Sleeping bag",
    notes: "This bag keeps me warm",
    userId: user.id,
  });
});

describe("searchGearQuery", () => {
  it("should return nothing if the query is empty", async () => {
    const { ctx } = await createMockContext();

    const result = await searchGearQuery({ query: "" }, ctx);

    expect(result.length).toEqual(0);
  });

  it("should return gear that matches the query by name", async () => {
    const { ctx } = await createMockContext();

    const result1 = await searchGearQuery({ query: "tent" }, ctx);

    expect(result1.length).toEqual(1);
    expect(result1[0]?.name).toEqual("Tent");

    const result2 = await searchGearQuery({ query: "sleep" }, ctx);

    expect(result2.length).toEqual(1);
    expect(result2[0]?.name).toEqual("Sleeping bag");
  });

  it("should allow small spelling mistakes", async () => {
    const { ctx } = await createMockContext();

    const result1 = await searchGearQuery({ query: "tnt" }, ctx);

    expect(result1.length).toEqual(1);
    expect(result1[0]?.name).toEqual("Tent");

    const result2 = await searchGearQuery({ query: "sleping bg" }, ctx);

    expect(result2.length).toEqual(1);
    expect(result2[0]?.name).toEqual("Sleeping bag");
  });
});
