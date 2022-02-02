import createMockContext from "test/create-mock-context";

import db from "db";

import searchGearQuery from "./search-gear-query";

const GEAR_VALUES = {
  weight: 100,
  imageUrl: "https://example.com/example.png",
  link: "https://example.com/",
  consumable: false,
  price: 10000,
  currency: "GBP",
} as const;

beforeEach(async () => {
  const user = await db.user.create({
    data: {
      email: "example@hikerherd.com",
      username: "testuser",
      hashedPassword: "fakehash",
    },
  });

  await db.gear.create({
    data: {
      ...GEAR_VALUES,
      name: "Tent",
      notes: "This tent shelters me",
      userId: user.id,
    },
  });

  await db.gear.create({
    data: {
      ...GEAR_VALUES,
      name: "Sleeping bag",
      notes: "This bag keeps me warm",
      userId: user.id,
    },
  });
});

describe("searchGearQuery", () => {
  it("should nothing if the query is empty", async () => {
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

  it("should return gear that matches the query by notes", async () => {
    const { ctx } = await createMockContext();

    const result1 = await searchGearQuery({ query: "shelter" }, ctx);

    expect(result1.length).toEqual(1);
    expect(result1[0]?.name).toEqual("Tent");

    const result2 = await searchGearQuery({ query: "this" }, ctx);
    expect(result2.length).toEqual(2);
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
