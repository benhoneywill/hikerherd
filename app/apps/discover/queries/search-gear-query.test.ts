import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createGear from "test/factories/create-gear";

import searchGearQuery from "./search-gear-query";

beforeEach(async () => {
  const user = await createUser({});

  await createGear({
    name: "Tent",
    notes: "This tent shelters me",
    userId: user.id,
  });

  await createGear({
    name: "Sleeping bag",
    notes: "This bag keeps me warm",
    userId: user.id,
    weight: 100,
  });

  await createGear({
    name: "Sleeping bag",
    notes: "This is my second bag",
    userId: user.id,
    weight: 300,
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

    expect(result2.length).toEqual(2);
    expect(result2[0]?.name).toEqual("Sleeping bag");
    expect(result2[1]?.name).toEqual("Sleeping bag");
  });

  it("should filter by weight", async () => {
    const { ctx } = await createMockContext();

    const result1 = await searchGearQuery(
      { query: "sleep", maxWeight: 200 },
      ctx
    );

    expect(result1.length).toEqual(1);
    expect(result1[0]?.name).toEqual("Sleeping bag");
    expect(result1[0]?.weight).toEqual(100);

    const result2 = await searchGearQuery(
      { query: "sleep", minWeight: 200 },
      ctx
    );

    expect(result2.length).toEqual(1);
    expect(result2[0]?.name).toEqual("Sleeping bag");
    expect(result2[0]?.weight).toEqual(300);

    const result3 = await searchGearQuery(
      { query: "sleep", minWeight: 200, maxWeight: 250 },
      ctx
    );

    expect(result3.length).toEqual(0);
  });
});
