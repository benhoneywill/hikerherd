import type { TestCsvItem } from "./get-csv-item";

import papaparse from "papaparse";

export const CSV_HEADING = [
  "name",
  "category",
  "weight",
  "unit",
  "notes",
  "price",
  "currency",
  "link",
  "image",
  "consumable",
  "worn",
  "quantity",
] as const;

const getCsv = (data: { [name: string]: TestCsvItem[] }) => {
  const items = Object.values(data).flat();

  return papaparse.unparse([
    CSV_HEADING,
    ...items.map((item) => CSV_HEADING.map((key) => item[key])),
  ]);
};

export default getCsv;
