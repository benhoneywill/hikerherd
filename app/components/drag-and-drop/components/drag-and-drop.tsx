import type { FC } from "react";
import type { DragAndDropContext } from "../contexts/gear-dnd-context";
import type { DropResult } from "react-beautiful-dnd";

import { DragDropContext } from "react-beautiful-dnd";

import dragAndDropContext from "../contexts/gear-dnd-context";

import CategoryDropZone from "./category-drop-zone";

type DragAndDropProps = DragAndDropContext & {
  handleDrop?: (drop: DropResult) => void;
};

const DragAndDrop: FC<DragAndDropProps> = ({ handleDrop, ...props }) => {
  return (
    <DragDropContext onDragEnd={handleDrop || (() => null)}>
      <dragAndDropContext.Provider value={props}>
        <CategoryDropZone />
      </dragAndDropContext.Provider>
    </DragDropContext>
  );
};

export default DragAndDrop;
