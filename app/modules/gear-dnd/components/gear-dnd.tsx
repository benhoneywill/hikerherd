import type { FC } from "react";
import type { GearDndContext } from "../contexts/gear-dnd-context";
import type { DropResult } from "react-beautiful-dnd";

import { DragDropContext } from "react-beautiful-dnd";

import gearDndContext from "../contexts/gear-dnd-context";

import CategoryDropZone from "./category-drop-zone";

type GearDndProps = GearDndContext & {
  handleDrop?: (drop: DropResult) => void;
};

const GearDnd: FC<GearDndProps> = ({ handleDrop, ...props }) => {
  return (
    <DragDropContext onDragEnd={handleDrop || (() => null)}>
      <gearDndContext.Provider value={props}>
        <CategoryDropZone />
      </gearDndContext.Provider>
    </DragDropContext>
  );
};

export default GearDnd;
