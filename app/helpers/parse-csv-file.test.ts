import type { TestCsvItem } from "test/data/get-csv-item";

import faker from "@faker-js/faker";

import getCsv from "test/data/get-csv";
import getCsvData from "test/data/get-csv-data";
import getCsvItem from "test/data/get-csv-item";

import parseCsvFile from "./parse-csv-file";
import signToCurrency from "./sign-to-currency";

describe("parseCsvFile", () => {
  it("should correctly parse and format the csv", () => {
    const categories = [
      faker.random.word(),
      faker.random.word(),
      faker.random.word(),
    ];

    const data = getCsvData(categories);
    const testCsv = getCsv(data);

    const result = parseCsvFile(testCsv);

    expect(Object.keys(result)).toEqual(categories);

    categories.forEach((categoryName) => {
      expect(result[categoryName]?.length).toEqual(data[categoryName]?.length);
    });

    const category = categories[0] as string;
    const gear = data[category]?.[0] as TestCsvItem;
    const resultItem = result[category]?.[0];

    expect(resultItem).toMatchObject({
      category,
      worn: false,
      quantity: Number(gear.quantity),
      notes: gear.notes,
      gear: {
        name: gear.name,
        weight: Number(gear.weight),
        price: Math.round(Number(gear.price) * 100),
        currency: signToCurrency(gear.currency),
        consumable: !!gear.consumable,
        link: gear.link,
        notes: gear.notes,
        imageUrl: gear.image,
      },
    });
  });

  it("should error if category is empty", () => {
    const data = {
      "": [getCsvItem({ category: "" })],
    };

    expect(() => parseCsvFile(getCsv(data))).toThrow();
  });

  it("should error if name is empty", () => {
    const data = {
      "": [getCsvItem({ name: "" })],
    };

    expect(() => parseCsvFile(getCsv(data))).toThrow();
  });

  it("should error if weight is not a number", () => {
    const data = {
      "": [getCsvItem({ weight: faker.random.word() as any })],
    };

    expect(() => parseCsvFile(getCsv(data))).toThrow();
  });

  it("should error if unit is not valid", () => {
    const data = {
      "": [getCsvItem({ unit: faker.random.word() as any })],
    };

    expect(() => parseCsvFile(getCsv(data))).toThrow();
  });

  it("should error if price is not a number", () => {
    const data = {
      "": [getCsvItem({ price: faker.random.word() as any })],
    };

    expect(() => parseCsvFile(getCsv(data))).toThrow();
  });

  it("should error if currency is invalid", () => {
    const data = {
      "": [getCsvItem({ currency: faker.random.word() as any })],
    };

    expect(() => parseCsvFile(getCsv(data))).toThrow();
  });

  it("should error if link is invalid", () => {
    const data = {
      "": [getCsvItem({ link: faker.random.word() })],
    };

    expect(() => parseCsvFile(getCsv(data))).toThrow();
  });

  it("should error if image is invalid", () => {
    const data = {
      "": [getCsvItem({ image: faker.random.word() })],
    };

    expect(() => parseCsvFile(getCsv(data))).toThrow();
  });

  it("should error if quantity is invalid", () => {
    const data = {
      "": [getCsvItem({ quantity: faker.random.word() as any })],
    };

    expect(() => parseCsvFile(getCsv(data))).toThrow();
  });

  it("should otherwise succeed with minimal data provided", () => {
    const category = faker.random.word();
    const name = faker.random.word();
    const weight = faker.datatype.number();

    const data = {
      "": [
        getCsvItem({
          name,
          category,
          weight: `${weight}`,
          notes: "",
          price: "",
          currency: "",
          link: "",
          image: "",
          consumable: "",
          worn: "",
          quantity: "",
        }),
      ],
    };

    const result = parseCsvFile(getCsv(data));

    expect(result[category]?.[0]).toMatchObject({
      category,
      worn: false,
      quantity: 1,
      notes: null,
      gear: {
        name,
        weight: Number(weight),
        price: null,
        currency: "USD",
        consumable: false,
        link: null,
        notes: null,
        imageUrl: null,
      },
    });
  });
});
