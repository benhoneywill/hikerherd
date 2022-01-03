import db from "db";

beforeEach(async () => {
  await db.$reset();
});

afterAll(async () => {
  await db.$reset();
});
