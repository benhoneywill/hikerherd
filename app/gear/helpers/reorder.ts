type ReorderOptions<T> = {
  state: Array<T>;
  from?: number;
  to?: number;
  item?: T;
};

const isPositiveInt = (num?: number): num is number => {
  const isNumber = !!num || num === 0;
  return isNumber && num >= 0;
};

const reorder = <T extends any>({
  state,
  from,
  to,
  item,
}: ReorderOptions<T>) => {
  const newState = [...state];

  if (isPositiveInt(from)) {
    newState.splice(from, 1);
  }

  if (isPositiveInt(to)) {
    if (item) {
      newState.splice(to, 0, item);
    } else if (isPositiveInt(from)) {
      const element = state[from];
      if (element) {
        newState.splice(to, 0, element);
      }
    }
  }

  return newState;
};

export default reorder;
