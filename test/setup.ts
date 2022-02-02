import db from "db";

// Required env var for some tests
process.env.BLITZ_APP_DIR = ".";

beforeEach(async () => {
  await db.$reset();
});

afterAll(async () => {
  await db.$reset();
});
