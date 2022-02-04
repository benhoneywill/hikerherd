import reorder from "./reorder";

type ReorderNestedCategory = { id: string; items: any[] };
type ReorderNestedOptions<T extends ReorderNestedCategory> = {
  state: Array<T>;
  source: {
    droppableId: string;
    index: number;
  };
  destination: {
    droppableId: string;
    index: number;
  };
};

const reorderNested = <T extends ReorderNestedCategory>({
  state,
  source,
  destination,
}: ReorderNestedOptions<T>) => {
  return state.map((category) => {
    const isSource = category.id === source.droppableId;
    const isDestination = category.id === destination.droppableId;

    if (isSource && isDestination) {
      return {
        ...category,
        items: reorder({
          state: category.items,
          from: source.index,
          to: destination.index,
        }),
      };
    }

    if (isSource) {
      return {
        ...category,
        items: reorder({
          state: category.items,
          from: source.index,
        }),
      };
    }

    if (isDestination) {
      const sourceCategory = state.find((cat) => cat.id === source.droppableId);

      if (sourceCategory) {
        return {
          ...category,
          items: reorder({
            state: category.items,
            to: destination.index,
            item: sourceCategory.items[source.index],
          }),
        };
      }
    }

    return category;
  });
};

export default reorderNested;
