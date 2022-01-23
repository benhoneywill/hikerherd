import type { FC } from "react";
import type { CategoryType } from "@prisma/client";
import type { DragAndDropState } from "app/modules/drag-and-drop/contexts/gear-dnd-context";

import { useEffect, useState } from "react";
import { useQuery } from "blitz";

import GearOrganizerProvider from "../providers/gear-organizer-provider";
import inventoryQuery from "../queries/inventory-query";

import GearOrganizerModals from "./gear-organizer-modals";
import GearOrganizerDragAndDrop from "./gear-organizer-drag-and-drop";

type GearOrganizerProps = {
  type: CategoryType;
};

const GearOrganizer: FC<GearOrganizerProps> = ({ type }) => {
  const [data, { refetch }] = useQuery(inventoryQuery, { type });
  const [state, setState] = useState<DragAndDropState>(data);

  useEffect(() => {
    setState(data);
  }, [data]);

  return (
    <GearOrganizerProvider state={state} setState={setState} refetch={refetch}>
      <GearOrganizerModals type={type} />
      <GearOrganizerDragAndDrop type={type} />
    </GearOrganizerProvider>
  );
};

export default GearOrganizer;
