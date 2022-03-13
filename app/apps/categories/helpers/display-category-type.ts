import type { CategoryType } from "db";

const displayCategoryType = (type: CategoryType) => {
  switch (type) {
    case "INVENTORY":
      return "Inventory";
    case "WISH_LIST":
      return "Wish List";
  }
};

export default displayCategoryType;
