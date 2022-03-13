import displayCurrency from "./display-currency";

describe("currencyToSign", () => {
  it("should return the correct sign", () => {
    expect(displayCurrency("USD")).toEqual("$");
    expect(displayCurrency("GBP")).toEqual("£");
    expect(displayCurrency("EUR")).toEqual("€");
  });
});
