import type { TestCsvItem } from "./get-csv-item";

import getCsvItem from "./get-csv-item";

const getCsvData = (categories: string[]) => {
  return categories.reduce((result, category) => {
    return {
      ...result,
      [category]: [
        getCsvItem({ category }),
        getCsvItem({ category }),
        getCsvItem({ category }),
      ],
    };
  }, {} as { [name: string]: TestCsvItem[] });
};

export default getCsvData;
