import type { User, Pack } from "db";

import createGear from "test/factories/create-gear";
import createMockContext from "test/helpers/create-mock-context";
import createPack from "test/factories/create-pack";
import createPackCategory from "test/factories/create-pack-category";
import createPackCategoryItem from "test/factories/create-pack-category-item";
import createUser from "test/factories/create-user";

import userQuery from "./user-query";

let user: User;
let pack: Pack;

beforeEach(async () => {
  user = await createUser({});
  pack = await createPack({ userId: user.id });
  await createPack({ userId: user.id });
  await createPack({ userId: user.id, private: true });
  const category = await createPackCategory({ packId: pack.id });
  const gear = await createGear({
    userId: user.id,
    weight: 100,
    consumable: true,
  });
  await createPackCategoryItem({
    gearId: gear.id,
    categoryId: category.id,
    quantity: 2,
  });
});

describe("userQuery", () => {
  it("should fetch the user and their packs by their username", async () => {
    const { ctx } = await createMockContext();

    const fetched = await userQuery({ username: user.username }, ctx);

    expect(fetched?.id).toEqual(user.id);
    expect(fetched?.username).toEqual(user.username);
    expect(fetched?.avatar_id).toEqual(user.avatar_id);
    expect((fetched as any)?.email).not.toBeDefined();

    expect(fetched.packs.length).toEqual(2);

    const foundPack = fetched.packs.find((p) => p.name === pack.name);

    expect(foundPack?.totals.totalWeight).toEqual(200);
    expect(foundPack?.totals.baseWeight).toEqual(0);
  });
});
