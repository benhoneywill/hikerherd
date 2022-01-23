import type { BlitzPage } from "blitz";
import type { DragAndDropState } from "../contexts/gear-dnd-context";

import { useContext } from "react";

import { Draggable } from "react-beautiful-dnd";
import { Box } from "@chakra-ui/layout";

import GearCard from "app/modules/gear-card/components/gear-card";

import dragAndDropContext from "../contexts/gear-dnd-context";

type DraggableGearProps = {
  item: DragAndDropState[number]["items"][number];
  index: number;
};

const DraggableGear: BlitzPage<DraggableGearProps> = ({ item, index }) => {
  const { itemMenu, readonly } = useContext(dragAndDropContext);

  return (
    <Draggable draggableId={item.id} index={index} isDragDisabled={readonly}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          userSelect="none"
        >
          <GearCard
            name={item.gear.name}
            weight={item.gear.weight}
            price={item.gear.price}
            currency={item.gear.currency}
            worn={item.worn}
            consumable={item.gear.consumable}
            link={item.gear.link}
            notes={item.notes || item.gear.notes}
            dragging={snapshot.isDragging}
            quantity={item.quantity}
            menu={itemMenu && itemMenu(item)}
            imageUrl={item.gear.imageUrl}
          />
        </Box>
      )}
    </Draggable>
  );
};

export default DraggableGear;
