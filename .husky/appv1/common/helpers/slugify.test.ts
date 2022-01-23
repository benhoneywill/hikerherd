import slugify from "./slugify";

describe("slugify", () => {
  it("should correctly slugify strings", () => {
    expect(slugify("Test 1 string")).toEqual("test-1-string");

    expect(slugify("Test! special characters?!")).toEqual(
      "test-special-characters"
    );

    expect(slugify(" trailing space @ @ *  ")).toEqual("trailing-space");

    expect(slugify("consecutive--.& ^ * ( ) _/nonsense")).toEqual(
      "consecutive-nonsense"
    );
  });

  it("should add a random suffix 10 alphanumeric characters long", () => {
    expect(slugify("Test 1+ strings", { withRandomSuffix: true })).toMatch(
      /test-1-strings-[a-zA-Z0-9]{10}/
    );

    expect(
      slugify("Test! special@ @ @ chars", {
        withRandomSuffix: true,
      })
    ).toMatch(/test-special-chars-[a-zA-Z0-9]{10}/);

    expect(slugify(" trailing space  ", { withRandomSuffix: true })).toMatch(
      /trailing-space-[a-zA-Z0-9]{10}/
    );
  });
});
