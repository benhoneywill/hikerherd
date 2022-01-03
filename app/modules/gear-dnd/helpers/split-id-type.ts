const splitIdType = (draggableId: string) => {
  const splitId = draggableId.split("__");
  let type = splitId[0] as string;
  let id = splitId.slice(1).join("__");

  return {
    id: id || type,
    type: id ? type : null,
  };
};

export default splitIdType;
