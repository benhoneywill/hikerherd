import type { BlitzPage } from "blitz";
import type { Gear } from "db";

import { useEffect, useState } from "react";

import { Draggable } from "react-beautiful-dnd";
import { Button } from "@chakra-ui/button";

import GearForm from "./gear-form";

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: 8 * 2,
  margin: `0 0 ${8}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

type DraggableGearProps = {
  gear: Gear;
  index: number;
};

const DraggableGear: BlitzPage<DraggableGearProps> = ({
  gear: gearProp,
  index,
}) => {
  const [gear, setGear] = useState(gearProp);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setGear(gearProp);
  }, [gearProp]);

  return (
    <>
      <GearForm
        isOpen={!!editing}
        gear={gear}
        onSuccess={(gear) => setGear(gear)}
        onClose={() => setEditing(false)}
      />

      <Draggable draggableId={gear.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
          >
            <p>{gear.name}</p>
            <Button size="xs" onClick={() => setEditing(true)}>
              Edit
            </Button>
          </div>
        )}
      </Draggable>
    </>
  );
};

export default DraggableGear;
