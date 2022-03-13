import displayWeight from "./display-weight";

describe("displayWeight", () => {
  it("should return the correct weight", () => {
    expect(displayWeight(10, "METRIC")).toEqual("10g");
    expect(displayWeight(10, "IMPERIAL")).toEqual("0.35oz");

    expect(displayWeight(100, "METRIC", true)).toEqual("0.1kg");
    expect(displayWeight(1000, "METRIC", true)).toEqual("1kg");

    expect(displayWeight(100, "IMPERIAL", true)).toEqual("0.22lb");
    expect(displayWeight(1000, "IMPERIAL", true)).toEqual("2.2lb");
  });
});
