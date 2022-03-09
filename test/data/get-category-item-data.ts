export type CategoryItemValues = {
  index?: number;
};

const getCategoryItemData = (values: CategoryItemValues) => ({
  index: 0,
  ...values,
});

export default getCategoryItemData;
