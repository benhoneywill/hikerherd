import type { FC } from "react";
import type { DragAndDropState } from "app/modules/drag-and-drop/contexts/gear-dnd-context";

import { useEffect, useState } from "react";
import { useQuery } from "blitz";

import GearOrganizerProvider from "app/features/inventory/providers/gear-organizer-provider";

import packOrganizerQuery from "../queries/pack-organizer-query";

import PackOrganizerModals from "./pack-organizer-modals";
import PackOrganizerDragAndDrop from "./pack-organizer-drag-and-drop";

type PackOrganizerProps = {
  id: string;
};

const PackOrganizer: FC<PackOrganizerProps> = ({ id }) => {
  const [data, { refetch }] = useQuery(packOrganizerQuery, { id });
  const [state, setState] = useState<DragAndDropState>(data.categories);

  useEffect(() => {
    setState(data.categories);
  }, [data.categories]);

  return (
    <GearOrganizerProvider state={state} setState={setState} refetch={refetch}>
      <PackOrganizerModals id={id} />
      <PackOrganizerDragAndDrop />
    </GearOrganizerProvider>
  );
};

export default PackOrganizer;
