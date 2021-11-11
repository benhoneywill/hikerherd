import db from "db";

jest.mock("integrations/postmark", () => ({
  postmark: jest.fn(),
}));

beforeEach(async () => {
  await db.$reset();
});
