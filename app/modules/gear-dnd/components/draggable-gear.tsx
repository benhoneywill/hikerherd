import type { BlitzPage } from "blitz";
import type { GearDndState } from "../contexts/gear-dnd-context";

import { Draggable } from "react-beautiful-dnd";
import { Box } from "@chakra-ui/layout";

import GearCard from "app/common/components/gear-card";

import useGearDnd from "../hooks/use-gear-dnd";

type DraggableGearProps = {
  item: GearDndState[number]["items"][number];
  index: number;
};

const DraggableGear: BlitzPage<DraggableGearProps> = ({ item, index }) => {
  const { itemMenu } = useGearDnd();

  return (
    <Draggable draggableId={item.id} index={index}>
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
            worn={item.worn}
            consumable={item.gear.consumable}
            link={item.gear.link}
            notes={(item as any)?.notes || item.gear.notes}
            dragging={snapshot.isDragging}
            menu={itemMenu(item)}
            imageUrl={item.gear.imageUrl}
          />
        </Box>
      )}
    </Draggable>
  );
};

export default DraggableGear;
