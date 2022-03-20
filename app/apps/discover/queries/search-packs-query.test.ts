import type { User } from "@prisma/client";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createPack from "test/factories/create-pack";
import createPackCategory from "test/factories/create-pack-category";
import createPackCategoryItem from "test/factories/create-pack-category-item";
import createGear from "test/factories/create-gear";

import searchPacksQuery from "./search-packs-query";

const createNonEmptyPack = async (
  user: User,
  name: string,
  isPrivate?: boolean
) => {
  const gear = await createGear({ userId: user.id });

  const pack = await createPack({
    name,
    userId: user.id,
    private: !!isPrivate,
  });

  const category = await createPackCategory({
    packId: pack.id,
  });

  await createPackCategoryItem({
    categoryId: category.id,
    gearId: gear.id,
  });
};

beforeEach(async () => {
  const user = await createUser({});

  await createNonEmptyPack(user, "PCT 2022");
  await createNonEmptyPack(user, "CDT 2022");
});

describe("searchPacksQuery", () => {
  it("should return nothing if the query is empty", async () => {
    const { ctx } = await createMockContext();

    const result = await searchPacksQuery({ query: "" }, ctx);

    expect(result.length).toEqual(0);
  });

  it("should return packs that match the query by name", async () => {
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

    await createNonEmptyPack(user, "CDT 2022", true);

    const result = await searchPacksQuery({ query: "private" }, ctx);

    expect(result.length).toEqual(0);
  });

  it("should not return empty packs", async () => {
    const { ctx } = await createMockContext();

    const user = await createUser({});

    const pack = await createPack({
      name: "empty 1",
      userId: user.id,
    });

    await createPackCategory({
      packId: pack.id,
    });

    await createPack({
      name: "empty 2",
      userId: user.id,
    });

    const result = await searchPacksQuery({ query: "empty" }, ctx);

    expect(result.length).toEqual(0);
  });
});
