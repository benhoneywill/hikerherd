import pluralize from "./pluralize";

describe("pluralize", () => {
  it("should correctly pluralize strings", () => {
    expect(pluralize(0, "comment")).toEqual("0 comments");

    expect(pluralize(1, "user")).toEqual("1 user");

    expect(pluralize(42, "post")).toEqual("42 posts");
  });

  it("should correctly pluralize strings with a custom plural noun", () => {
    expect(pluralize(0, "entity", "entities")).toEqual("0 entities");

    expect(pluralize(1, "entity", "entities")).toEqual("1 entity");

    expect(pluralize(2, "entity", "entities")).toEqual("2 entities");
  });
});
