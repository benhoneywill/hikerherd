import type { BlitzPage } from "blitz";
import type { DragAndDropState } from "../contexts/gear-dnd-context";
import type { DraggableProvided } from "react-beautiful-dnd";

import { useContext } from "react";

import { Box } from "@chakra-ui/layout";

import GearCard from "app/modules/gear-card/components/gear-card";

import dragAndDropContext from "../contexts/gear-dnd-context";

type GearProps = {
  item: DragAndDropState[number]["items"][number];
  isDragging: boolean;
  provided: DraggableProvided;
};

const Gear: BlitzPage<GearProps> = ({ item, isDragging, provided }) => {
  const { itemMenu, editItem } = useContext(dragAndDropContext);

  return (
    <Box
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={provided.draggableProps.style}
      userSelect="none"
      py={1}
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
        dragging={isDragging}
        quantity={item.quantity}
        menu={itemMenu && itemMenu(item)}
        imageUrl={item.gear.imageUrl}
        onHeadingClick={editItem && (() => editItem(item.id))}
      />
    </Box>
  );
};

export default Gear;
