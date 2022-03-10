import type { TestCsvItem } from "./get-csv-item";

import getCsvItem from "./get-csv-item";

const getCsvData = (categories: string[]) => {
  return categories.reduce((result, categoryName) => {
    return {
      ...result,
      [categoryName]: [
        getCsvItem({ categoryName }),
        getCsvItem({ categoryName }),
        getCsvItem({ categoryName }),
      ],
    };
  }, {} as { [name: string]: TestCsvItem[] });
};

export default getCsvData;
