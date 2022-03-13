import signToCurrency from "./sign-to-currency";

describe("signToCurrency", () => {
  it("should return the correct currency", () => {
    expect(signToCurrency("$")).toEqual("USD");
    expect(signToCurrency("£")).toEqual("GBP");
    expect(signToCurrency("€")).toEqual("EUR");
  });
});
