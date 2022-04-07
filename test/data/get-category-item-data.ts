export type CategoryItemValues = {
  index?: number;
  quantity?: number;
};

const getCategoryItemData = (values: CategoryItemValues) => ({
  index: 0,
  quantity: 1,
  ...values,
});

export default getCategoryItemData;
