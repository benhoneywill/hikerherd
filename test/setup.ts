import db from "db";

beforeEach(async () => {
  await db.$reset();
});
