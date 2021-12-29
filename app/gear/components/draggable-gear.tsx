import type { BlitzPage } from "blitz";
import type { Gear } from "db";

import { useEffect, useState } from "react";

import { Draggable } from "react-beautiful-dnd";
import { IconButton } from "@chakra-ui/button";
import { Box, Heading, HStack } from "@chakra-ui/layout";
import { FaEdit, FaWeightHanging } from "react-icons/fa";
import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/tag";

import GearForm from "./gear-form";

type DraggableGearProps = {
  gear: Gear;
  index: number;
  itemIdPrefix?: string;
};

const DraggableGear: BlitzPage<DraggableGearProps> = ({
  gear: gearProp,
  index,
  itemIdPrefix,
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

      <Draggable
        draggableId={itemIdPrefix ? `${itemIdPrefix}|${gear.id}` : gear.id}
        index={index}
      >
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={provided.draggableProps.style}
            userSelect="none"
            bg="white"
            border="3px solid"
            borderColor={snapshot.isDragging ? "blue.400" : "white"}
            mb={2}
            p={2}
            pr={6}
            borderRadius="md"
            position="relative"
          >
            <IconButton
              position="absolute"
              top={1}
              right={1}
              icon={<FaEdit />}
              onClick={() => setEditing(true)}
              aria-label="edit"
              size="xs"
            />
            <Heading size="xs" mb={2}>
              {gear.name}
            </Heading>
            <HStack>
              <Tag size="sm" colorScheme="teal" variant="subtle">
                <TagLeftIcon as={FaWeightHanging} />
                <TagLabel>{gear.weight}g</TagLabel>
              </Tag>
            </HStack>
          </Box>
        )}
      </Draggable>
    </>
  );
};

export default DraggableGear;
