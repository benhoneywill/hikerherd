import slugify from "./slugify";

describe("slugify", () => {
  it("should correctly slugify strings", () => {
    const test1 = slugify("Test 1 string");
    expect(test1).toEqual("test-1-string");

    const test2 = slugify("Test! special characters?!");
    expect(test2).toEqual("test-special-characters");

    const test3 = slugify(" trailing space @ @ *  ");
    expect(test3).toEqual("trailing-space");

    const test4 = slugify("consecutive--.& ^ * ( ) _/nonsense");
    expect(test4).toEqual("consecutive-nonsense");
  });

  it("should add a random suffix 8 alphanumeric characters long", () => {
    const test1 = slugify("Test 1+ strings", { withRandomSuffix: true });
    expect(test1).toMatch(/test-1-strings-[a-zA-Z0-9]{8}/);

    const test2 = slugify("Test! special@ @ @ chars", { withRandomSuffix: true });
    expect(test2).toMatch(/test-special-chars-[a-zA-Z0-9]{8}/);

    const test3 = slugify(" trailing space  ", { withRandomSuffix: true });
    expect(test3).toMatch(/trailing-space-[a-zA-Z0-9]{8}/);
  });
});
