import type { DragAndDropState } from "../contexts/gear-dnd-context";
import type { FC } from "react";

import { useContext, memo } from "react";

import { Draggable } from "react-beautiful-dnd";

import dragAndDropContext from "../contexts/gear-dnd-context";

import Gear from "./gear";

type DraggableGearProps = {
  data: DragAndDropState[number]["items"];
  index: number;
};

const DraggableGear: FC<DraggableGearProps> = memo(({ data, index }) => {
  const { readonly } = useContext(dragAndDropContext);

  const item = data[index];

  if (!item) return null;

  return (
    <Draggable
      draggableId={item.id}
      index={index}
      isDragDisabled={readonly}
      key={item.id}
    >
      {(provided, snapshot) => (
        <Gear
          item={item}
          isDragging={snapshot.isDragging}
          provided={provided}
        />
      )}
    </Draggable>
  );
});

export default DraggableGear;
